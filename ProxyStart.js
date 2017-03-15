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

        app.listen(62590, function () {
            console.log('Server running at http://127.0.0.1:62590');
        })
    }
});

// Fiware Subscription endpoint
app.post('/FiwareNotificationEndpoint', function(request, response) {
    var temp = request.body['data']; // Root
    console.log(temp)
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
            fiwareController.executeQueryEntity(fiwareDeviceInfo, function (detailFiwareDeviceInfo) {
                callbackForOneM2M(null, detailFiwareDeviceInfo);
            });
        },

        // oneM2M Registration callback
        function(detailFiwareDeviceInfo, callbackAboutOneM2MRegistration){
            oneM2MController.registrationFiwareToOneM2M(detailFiwareDeviceInfo, function () {
                callbackAboutOneM2MRegistration(null, detailFiwareDeviceInfo);
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
    ], function (err, result) {
        response.status(200).send('WISE-IoT');
    });
});

// Server testing code
app.get('/', function (request, response) {
    response.send('<h1>'+ 'WISE-IoT' + '</h1>');
});

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