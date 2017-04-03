/**
 * Created by JaeYoungHwang on 2017-02-23.
 */

// extract the modules
var fs = require('fs');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var fiwareController = require('./ProxyModule/FiwareController');
var oneM2MController = require('./ProxyModule/oneM2MController');
var statusCodeMessage = require('./ETC/StatusCode');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

global.fiwareService = '';
global.fiwareServicePath = '';
global.fiwareIP = '';
global.yellowTurtleIP = '';
global.proxyIP = '';
global.proxyPort = '';
global.notificationURL = '';

fs.readFile('conf.json', 'utf-8', function (err, data) {
    if (err) {
        console.log("FATAL An error occurred trying to read in the file: " + err);
        console.log("error : set to default for configuration");
    } else {
        var conf = JSON.parse(data)['proxy:conf'];

        fiwareService = conf['fiwareService'];
        fiwareServicePath = conf['fiwareServicePath'];
        fiwareIP = conf['fiwareIP'];
        yellowTurtleIP = conf['yellowTurtleIP'];
        proxyIP = conf['proxyIP'];
        proxyPort = conf['proxyPort'];
        notificationURL = conf['notificationURL'];

        fs.readFile('subscriptionList.txt', 'utf-8', function (err, data) {
            if (err) {
                console.log("FATAL An error occurred trying to read in the file: " + err);
            } else {
                var subIdArray = data.split("\n");

                if(subIdArray.length > 0 && subIdArray[0] != '') {
                    console.log('Subscription Delete start....');

                    fiwareController.executeUnsubscriptionEntity(subIdArray, function (requestResult, statusCode) {

                        if(requestResult) { // success (true)
                            fs.writeFile('subscriptionList.txt', '', function (err) {
                                if (err)
                                    console.log('FATAL An error occurred trying to write in the file: ' + err);
                                else {
                                    serverStartFunction();
                                }
                            });
                        } else { // fail (false)
                            console.log(statusCodeMessage.statusCodeGenerator(statusCode));
                        }
                    });
                } else {
                    serverStartFunction();
                }
            }
        });
    }
});

// Fiware Subscription endpoint
app.post('/FiwareNotificationEndpoint', function(request, response) {
    oneM2MController.updateFiwareToOneM2M(request.body, function (statusCode) {
        if (statusCode == 201) {
            console.log('Fiware changed data update is finished');
            response.status(201).send(statusCodeMessage.statusCodeGenerator(statusCode));
        } else if (statusCode == 400) {
            console.log('Bad Request');
            response.status(400).send(statusCodeMessage.statusCodeGenerator(statusCode));
        } else if (statusCode == 408) {
            console.log('Request Timeout');
            response.status(408).send(statusCodeMessage.statusCodeGenerator(statusCode));
        }
    });
});

// Device information from MMG management system
app.post('/MMGDeviceInfoEndpoint', function(request, response) {
    var selectedDevices = request.body['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceCount = Object.keys(deviceInfo).length;

    var fiwareDeviceInfo = new Entity( ); // Device information container

    // get entity name and entity type for executing QueryEntity
    for(var i = 0; i < deviceCount; i++) {
        fiwareDeviceInfo.setEntityName(deviceInfo[Object.keys(deviceInfo)[i]].entityName);
        fiwareDeviceInfo.setEntityType(deviceInfo[Object.keys(deviceInfo)[i]].entityType);
    }

    async.waterfall([
        // Get Fiware device information
        function(callbackForOneM2M){
            fiwareController.executeQueryEntity(fiwareDeviceInfo, function (requestResult, statusCode, detailFiwareDeviceInfo) {

                if (requestResult) { // success (true)
                    callbackForOneM2M(null, detailFiwareDeviceInfo);
                } else { // fail (false)
                    callbackForOneM2M(statusCode, null);
                }
            });
        },

        // oneM2M Registration callback
        function(detailFiwareDeviceInfo, callbackAboutOneM2MRegistration){
            oneM2MController.registrationFiwareToOneM2M(detailFiwareDeviceInfo, function (statusCode) {
                if(statusCode == 201) {
                    callbackAboutOneM2MRegistration(null, detailFiwareDeviceInfo);
                } else {
                    callbackAboutOneM2MRegistration(statusCode, null);
                }
            });
        },

        // Fiware Subscription registration
        function(detailFiwareDeviceInfo, callbackFiwareSubscription){

            fiwareController.executeSubscriptionEntity(detailFiwareDeviceInfo, function (subscriptionArray) {
                var count = 0;
                async.whilst(
                    function () {
                        return count < subscriptionArray.length;
                    },
                    function (async_for_loop_callback) {
                        fs.appendFile('subscriptionList.txt', subscriptionArray[count], function (err) {
                            if(err) {
                                console.log('FATAL An error occurred trying to write in the file: ' + err);
                            } else {
                                count++; async_for_loop_callback();
                            }
                        });
                    },
                    function (err, n) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('SubscriptionID registration success!!');
                            callbackFiwareSubscription(null);
                        }
                    }
                );
            });
        }
    ], function (statusCode, result) { // response to client such as web or postman
        response.status(statusCode).send(statusCodeMessage.statusCodeGenerator(statusCode));
    });
});

// Server testing code
app.get('/', function (request, response) {
    response.send('<h1>'+ 'WISE-IoT' + '</h1>');
});

var serverStartFunction = function( ) {
    // Server start!!
    app.listen(62590, function () {
        console.log('Server running at http://127.0.0.1:62590');
    });
};

// Entity Container
function Entity( ) {
    // Pair Value
    this.entityName = []; // Mandatory field
    this.entityType = []; // Mandatory field

    this.setEntityName = function(entityName) {
        this.entityName.push(entityName);
    };

    this.getEntityName = function(selectedIndex) {
        return this.entityName[selectedIndex];
    };

    this.setEntityType = function (entityType) {
        this.entityType.push(entityType);
    };

    this.getEntityType = function(selectedIndex) {
        return this.entityType[selectedIndex];
    };

    this.getDeviceNumber = function ( ) {
        return this.entityName.length;
    }
}