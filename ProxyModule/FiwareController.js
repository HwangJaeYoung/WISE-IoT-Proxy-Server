/**
 * Created by JaeYoungHwang on 2017-03-07.
 */

// extract the modules
var async = require('async');
var getFiwareDeviceController = require('./FIWARE/FiwareQueryEntity');
var subFiwareDeviceController = require('./FIWARE/FiwareSubscription');

var iterationEntityQuery = function(fiwareDeviceInfo, fiwareControllerCallback) {
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

var iterationEntitySubscription = function(fiwareInformation, fiwareControllerCallback) {
    var count = 0;

    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceLists = Object.keys(deviceInfo).length;

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            subFiwareDeviceController.subFiwareDevice(deviceInfo[Object.keys(deviceInfo)[count]].entityName, deviceInfo[Object.keys(deviceInfo)[count]].entityType, deviceInfo[Object.keys(deviceInfo)[count]], function(responseObject) {
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
    iterationEntityQuery(fiwareDeviceInfo, fiwareControllerCallback);
};

exports.executeSubscriptionEntity = function (detailFiwareDeviceInfo, fiwareControllerCallback) {
    iterationEntitySubscription(detailFiwareDeviceInfo, fiwareControllerCallback);
};