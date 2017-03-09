/**
 * Created by JaeYoungHwang on 2017-02-28.
 */

// extract the modules
var async = require('async');
var AERegistration = require('./oneM2M/AERegistration');
var containerRegistration = require('./oneM2M/ContainerRegistration');

var fiwareDeviceRegistration = function(fiwareInformation){

    var count = 0;
    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceLists = Object.keys(deviceInfo).length;

    async.waterfall([

        // AE registration
        function(aeRegistrationCallback){
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
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("in");
                        // aeRegistrationCallback(null);
                    }
                }
            );
        },

        // Container, contentInstance Registration
        function(containerRegistrationCallback){

            count = 0; // Initialization for counting
            async.whilst(
                function () { return count < deviceLists; },

                function (async_for_loop_callback) {

                    // Creating AE name using Entity Name and Entity Type.
                    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;
                    containerRegistration.ContainerRegistrationExecution(AEName, deviceInfo[Object.keys(deviceInfo)[count]], function () {
                        count++; async_for_loop_callback(null, count);
                    });
                },
                function (err, n) {
                    if(err) {
                        console.log(err);
                    } else {
                        containerRegistrationCallback(null);
                    }
                }
            );
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