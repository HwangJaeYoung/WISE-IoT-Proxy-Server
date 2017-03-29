/**
 * Created by JaeYoungHwang on 2017-03-07.
 */

// extract the modules
var async = require('async');
var getFiwareDeviceController = require('./FIWARE/FiwareQueryEntity');
var subFiwareDeviceController = require('./FIWARE/FiwareSubscription');
var unsubFiwareDeviceController = require('./FIWARE/FiwareUnsubscription');

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
            getFiwareDeviceController.getFiwareDevice(fiwareDeviceInfo.entityName[count], fiwareDeviceInfo.entityType[count], function(statusCode, responseObject) {

                if(statusCode == 200) { // request success
                    // Defining FIWARE Device
                    var deviceName = "device" + (count + 1);
                    deviceObjectRoot[deviceName] = responseObject;

                    // Checking for iteration
                    count++; async_for_loop_callback(null, count);
                } else { // request fail
                    // call error function
                    async_for_loop_callback(statusCode);
                }
            });
        },
        function (statusCode, n) {
            if (statusCode) {
                fiwareControllerCallback(statusCode, null);
            } else {
                console.log("Fiware Device Retrieve is finished");
                fiwareDeviceInfoObject.deviceInfo = deviceObjectRoot;
                fiwareDevicesObject.FiwareDevices = fiwareDeviceInfoObject;
                fiwareControllerCallback(200, fiwareDevicesObject);
            }
        }
    );
};

var iterationEntitySubscription = function(fiwareInformation, fiwareControllerCallback) {
    var count = 0;

    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceLists = Object.keys(deviceInfo).length;

    var subscriptionIDCollector = new Array();

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            subFiwareDeviceController.subFiwareDevice(deviceInfo[Object.keys(deviceInfo)[count]].entityName, deviceInfo[Object.keys(deviceInfo)[count]].entityType, deviceInfo[Object.keys(deviceInfo)[count]], function(subscriptionID) {
                // Checking for iteration
                subscriptionIDCollector.push(subscriptionID + '\n');
                count++; async_for_loop_callback(null, count);
            });
        },
        function (err, n) {
            if (err) {
                console.log(err);
            } else {
                console.log("Fiware Device Subscription is finished");
                fiwareControllerCallback(subscriptionIDCollector);
            }
        }
    );
};

var iterationEntityUnsubscription = function(subscriptionIDArray, fiwareControllerCallback) {

    var count = 0;

    async.whilst(
        function () { return count < subscriptionIDArray.length; },

        function (async_for_loop_callback) {
            // Checking for iteration
            unsubFiwareDeviceController.unsubFiwareDevice(subscriptionIDArray[count], function(requestStatus) {
                // Unsubscribing operation success
                if(requestStatus) {
                    count++;
                    async_for_loop_callback(null, count);
                } else {  // Unsubscribing operation fail
                    async_for_loop_callback(null, count);
                }
            });
        },
        function (err, n) {
            if (err) {
                console.log(err);
            } else {
                console.log("Fiware Device Unsubscription is finished");
                fiwareControllerCallback();
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

exports.executeUnsubscriptionEntity = function (subscriptionID, fiwareControllerCallback) {
    iterationEntityUnsubscription(subscriptionID, fiwareControllerCallback);
};