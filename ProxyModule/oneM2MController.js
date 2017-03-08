/**
 * Created by JaeYoungHwang on 2017-02-28.
 */

// extract the modules
var async = require('async');
var AERegistration = require('./oneM2M/AERegistration');

var fiwareDeviceRegistration = function(fiwareInformation){

    var count = 0;
    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceLists = Object.keys(deviceInfo).length;

    async.waterfall([

        // AE registration
        function(fiwareCallback){
            async.whilst(
                function () { return count < deviceLists; },

                function (async_for_loop_callback) {

                    // Creating AE name using Entity Name and Entity Type.
                    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;
                    AERegistration.AERegistrationExecution(AEName, function () {
                        count++; async_for_loop_callback(null, count);
                    });
                },
                function (err, n) {
                    console.log("AE Regi End");

                }
            );
        },

        // Container, contentInstance Registration
        function(arg1, arg2, callback){

            count = 0;
            async.whilst(
                function () { return count < deviceLists; },

                function (async_for_loop_callback) {

                    var deviceObject = deviceInfo[Object.keys(deviceInfo)[count]];

                    var device = Object.keys(deviceObject);

                    // Creating AE name using Entity Name and Entity Type.
                    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;
                    AERegistration.AERegistrationExecution(AEName, function () {
                        count++; async_for_loop_callback(null, count);
                    });
                },
                function (err, n) {
                    console.log("AE Regi End");

                }
            );
            console.log("Testing : " + arg1 + arg2);
        },

        // Subscription Registration
        function(arg1, callback){
            callback(null, '끝');
        }
    ], function (err, result) {

    });
};

exports.registrationFiwareToOneM2M = function(fiwareInformation) {
    fiwareDeviceRegistration(fiwareInformation);
};