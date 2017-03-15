/**
 * Created by JaeYoungHwang on 2017-03-07.
 */

// extract the modules
var async = require('async');
var getFiwareDeviceController = require('./FIWARE/FiwareQueryEntity');
var subFiwareDeviceController = require('./FIWARE/FiwareSubscription');

var iterationQueryEntity = function(fiwareDeviceInfo, fiwareControllerCallback) {
    var count = 0;
    var deviceLists = fiwareDeviceInfo.getDeviceNumber();

    // JSON Structure for presenting FIWARE devices
    var deviceObjectRoot = new Object();
    var fiwareDevicesObject = new Object();
    var fiwareDeviceInfoObject = new Object();

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            getFiwareDeviceController.getFiwareDevice(fiwareDeviceInfo.entityName[count], fiwareDeviceInfo.entityType[count], function(responseObject) {

                // Defining FIWARE Device
                var deviceName = "device" + (count + 1);
                deviceObjectRoot[deviceName] = responseObject;

                // Checking for iteration
                count++; async_for_loop_callback(null, count);
            });
        },
        function (err, n) {
            if (err) {
                console.log(err);
            } else {
                console.log("Fiware Device Retrieve finish");
                fiwareDeviceInfoObject.deviceInfo = deviceObjectRoot;
                fiwareDevicesObject.FiwareDevices = fiwareDeviceInfoObject;
                fiwareControllerCallback(fiwareDevicesObject);
            }
        }
    );
};

var iterationEntitySubscription = function(fiwareDeviceInfo, fiwareControllerCallback) {
    var count = 0;
    var deviceLists = fiwareDeviceInfo.getDeviceNumber();

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            subFiwareDeviceController.subFiwareDevice(fiwareDeviceInfo.entityName[count], fiwareDeviceInfo.entityType[count], function(responseObject) {
                // Checking for iteration
                count++; async_for_loop_callback(null, count);
            });
        },
        function (err, n) {
            if (err) {
                console.log(err);
            } else {
                console.log("Fiware Device Subscription finish");
            }
        }
    );
};

exports.executeQueryEntity = function(fiwareDeviceInfo, fiwareControllerCallback) {
    iterationQueryEntity(fiwareDeviceInfo, fiwareControllerCallback);
};

exports.executeSubscription = function (fiwareDeviceInfo, fiwareControllerCallback) {
    iterationEntitySubscription(fiwareDeviceInfo, fiwareControllerCallback);
};