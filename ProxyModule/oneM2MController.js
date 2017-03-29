/**
 * Created by JaeYoungHwang on 2017-02-28.
 */

// extract the modules
var async = require('async');
var AERegistration = require('./oneM2M/AERegistration');
var containerRegistration = require('./oneM2M/ContainerRegistration');
var contentInstanceRegistration = require('./oneM2M/contentInsatnceRegistration');

var fiwareDeviceRegistration = function(fiwareInformation, oneM2MControllerCallback){

    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceLists = Object.keys(deviceInfo).length;

    async.waterfall([

        // AE registration
        function(aeRegistrationCallback){
            var count = 0;
            async.whilst(
                function () { return count < deviceLists; },

                function (async_for_loop_callback) {

                    // Creating AE name using Entity Name and Entity Type.
                    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;
                    AERegistration.AERegistrationExecution(AEName, function (statusCode) {

                        if (statusCode == 201) {
                            count++; async_for_loop_callback(null, count);
                        } else {
                            async_for_loop_callback(statusCode);
                        }
                    });
                },
                function (statusCode, n) {
                    if(statusCode) {
                        aeRegistrationCallback(statusCode);
                    } else {
                        console.log("AE Registration is finished");
                        aeRegistrationCallback(null);
                    }
                }
            );
        },

        // Container, contentInstance Registration
        function(containerRegistrationCallback){

            var count = 0; // Initialization for counting
            async.whilst(
                function () { return count < deviceLists; },

                function (async_for_loop_callback) {
                    // Creating AE name using Entity Name and Entity Type.
                    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;
                    containerRegistration.ContainerRegistrationExecution(AEName, deviceInfo[Object.keys(deviceInfo)[count]], function (statusCode) {

                        if (statusCode == 201) {
                            count++; async_for_loop_callback(null, count);
                        } else {
                            async_for_loop_callback(statusCode);
                        }
                    });
                },
                function (statusCode, n) {
                    if(statusCode) {
                        containerRegistrationCallback(statusCode);
                    } else {
                        console.log("AE Registration is finished");
                        containerRegistrationCallback(null);
                    }
                }
            );
        }
    ], function (statusCode, result) {

        if(statusCode == 201) {
            console.log("AE, Container, contentInstance registration is finished");
            oneM2MControllerCallback(statusCode);
        } else {
            oneM2MControllerCallback(statusCode);
        }
    });
};

var fiwareDeviceUpdateForOneM2M = function(fiwareInformation, oneM2MControllerCallback) {

    var attributeOrigin = fiwareInformation['data'][0]; // Root
    var attributeList = Object.keys(attributeOrigin);
    var attributeNumber = Object.keys(attributeOrigin).length;

    var count = 0; // Initialization for counting
    async.whilst(
        function () { return count < attributeNumber; },

        function (async_for_loop_callback) {
            // Creating AE name using Entity Name and Entity Type.
            var AEName = attributeOrigin.id + ":" + attributeOrigin.type;

            if ((attributeList[count] == 'id' || attributeList[count] == 'type') == false) {
                var containerName = attributeList[count];
                var contentInstanceValue = attributeOrigin[attributeList[count]].value;

                contentInstanceRegistration.contentInstanceRegistrationExecution(AEName, containerName, contentInstanceValue, function (statusCode) {

                    if(statusCode == 201) {
                        count++; async_for_loop_callback(null, count);
                    } else {
                        async_for_loop_callback(statusCode);
                    }
                });
            } else {
                count++; async_for_loop_callback(null, count);
            }
        },
        function (statusCode, n) {
            if(statusCode) {
                oneM2MControllerCallback(statusCode);
            } else {
                console.log("contentInstance Registration is finished");
                oneM2MControllerCallback(201);
            }
        }
    );
};

exports.registrationFiwareToOneM2M = function(fiwareInformation, oneM2MControllerCallback) {
    fiwareDeviceRegistration(fiwareInformation, oneM2MControllerCallback);
};

exports.updateFiwareToOneM2M = function (fiwareInformation, oneM2MControllerCallback) {
    fiwareDeviceUpdateForOneM2M(fiwareInformation, oneM2MControllerCallback);
};