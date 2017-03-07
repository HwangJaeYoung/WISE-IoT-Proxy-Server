/**
 * Created by JaeYoungHwang on 2017-02-23.
 */

// extract the modules
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var fiwareController = require('./ProxyModule/FiwareController');
var oneM2MController = require('./ProxyModule/oneM2MController');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));

global.fiwareService = '';
global.fiwareServicePath = '';
global.fiwareIP = '';
global.yellowTurtleIP = '';
global.proxyIP = '';
global.proxyPort = '';

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

        app.listen(62590, function () {
            console.log('Server running at http://127.0.0.1:62590');
        })
    }
});

// Fiware Subscription endpoint
app.post('/FiwareNotificationEndpoint', function(request, response) {

});

// Device information from MMG management system
app.post('/MMGDeviceInfoEndpoint', function(request, response) {

    fiwareController.QueryEntity(function (detailFiwareDeviceInfo) {

    })

    //register.fiwareDeviceRegistration();
    /*
    var selectedDevice = request.body['FiwareDevice'];

    var deviceInfo = JSON.parse(selectedDevice)['deviceInfo'];
    var deviceCount = Object.keys(deviceInfo).length;

    console.log(""+deviceCount);
    response.status(200).send('Hello');
    // var deviceKeyCount = Object.keys(deviceLists).length;

    /*
    for (var i = 0; i < deviceKeyCount; i++ ) {
        var device = deviceInfo[Object.keys(deviceInfo)[i]];
        entityNameArray[i] = device['entityName'];
        entityTypeArray[i] = device['entityType'];
    }

    // Starting registration
    var fiwareDeviceInfo = new Entity( );
    fiwareDeviceInfo.setEntityName(entityNameArray);
    fiwareDeviceInfo.setEntityType(entityTypeArray);

    // register.fiwareDeviceRegistration(fiwareInfo); */
});

// Server testing code
app.get('/', function (request, response) {
    response.send('<h1>'+ 'Hello' + '</h1>');
});

function Entity( ) {
    this.entityName = [];
    this.entityType = [];

    this.setEntityName = function(entityName) {
        this.entityName = entityName;
    };

    this.getEntityName = function( ) {
        return this.entityName;
    };

    this.setEntityType = function (entityType) {
        this.entityType = entityType;
    };

    this.getEntityType = function( ) {
        return this.entityType;
    };

    this.getEntityNameLength = function( ) {
        return this.entityName.length;
    };

    this.getEntityTypeLength = function( ) {
        return this.entityType.length;
    };
}