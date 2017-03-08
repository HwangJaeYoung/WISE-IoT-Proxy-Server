/**
 * Created by JaeYoungHwang on 2017-03-07.
 */

// extract the modules
var async = require('async');
var requestToAnotherServer = require('request');
var getFiwareDevice = require('./FIWARE/FiwareQueryEntity');

var iterationQueryEntity = function(fiwareDeviceInfo, fiwareControllerCallback) {

    var count = 0;
    var deviceLists = fiwareDeviceInfo.getDeviceNumber();

    var fiwareDevicesObject = new Object();

    var deviceObjectRoot = new Object();
    var fiwareDeviceInfoObject = new Object();

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            getFiwareDevice.getFiwareDevice(fiwareDeviceInfo.entityName[count], fiwareDeviceInfo.entityType[count], function(responseObject) {

                var deviceName = "device" + (count + 1);

                // Device
                deviceObjectRoot[deviceName] = responseObject;

                count++;
                async_for_loop_callback(null, count);
            });
        },
        function (err, n) {

            fiwareDeviceInfoObject.deviceInfo = deviceObjectRoot;
            fiwareDevicesObject.FiwareDevices = fiwareDeviceInfoObject;

            console.log(JSON.stringify(fiwareDevicesObject));
            console.log("end");
            //fiwareControllerCallback(fiwareDevices);
        }
    );
};

exports.executeQueryEntity = function(fiwareDeviceInfo, fiwareControllerCallback) {
    iterationQueryEntity(fiwareDeviceInfo, fiwareControllerCallback);
};