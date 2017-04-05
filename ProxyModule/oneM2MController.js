/**
 * Created by JaeYoungHwang on 2017-02-28.
 */

// extract the modules
var async = require('async');
var AERegistration = require('./oneM2M/AERegistration');
var containerRegistration = require('./oneM2M/ContainerRegistration');
var contentInstanceRegistration = require('./oneM2M/contentInsatnceRegistration');

var executeRegistrationAE = function(count, fiwareInformation, oneM2MControllerCallback){

    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;

    // Creating AE name using Entity Name and Entity Type.
    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;
    AERegistration.CallAERegistrationFunction(AEName, function (statusCode) {
        if(statusCode == 201)
            oneM2MControllerCallback(true, statusCode);
        else
            oneM2MControllerCallback(false, statusCode);
    })
};

var executeRegistrationConCin = function(count, fiwareInformation, oneM2MControllerCallback) {

    var attrCount = 0;

    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;
    var deviceKey = [Object.keys(deviceInfo)[count]]; // device1, device2, ... , deviceN
    var device = deviceInfo[deviceKey];

    // Getting device attributes such as entityName, temperature, pressure and so on.
    var attributeKey = Object.keys(device);
    var attributeCount = attributeKey.length;

    // Creating AE name using Entity Name and Entity Type.
    var AEName = device.entityName + ":" + device.entityType;

    async.whilst(
        function () {
            return attrCount < attributeCount;
        },

        function (async_for_loop_callback) {

            if ((attributeKey[attrCount] == 'entityName' || attributeKey[attrCount] == 'entityType') == false) {
                async.waterfall([
                    // Container Registration
                    function (callbackForOneM2M) {
                        var containerName = attributeKey[attrCount]; // Container Name
                        containerRegistration.ContainerRegistrationExecution(AEName, containerName, function (statusCode) {
                            if(statusCode == 201)
                                callbackForOneM2M(null);
                            else
                                callbackForOneM2M(statusCode, null);
                        });
                    },

                    // contentInstance Registration
                    function (callbackForOneM2M) {
                        var containerName = attributeKey[attrCount]; // Container Name
                        var contentInstanceValue = device[attributeKey[attrCount]].value;// contentInstance value
                        contentInstanceRegistration.contentInstanceRegistrationExecution(AEName, containerName, contentInstanceValue, function (statusCode) {
                            if(statusCode == 201)
                                callbackForOneM2M(null);
                            else
                                callbackForOneM2M(statusCode, null);
                        });
                    }
                ], function (statusCode, result) { // response to client such as web or postman
                    if(statusCode) {
                        async_for_loop_callback(statusCode); // error case
                    } else {
                        attrCount++; async_for_loop_callback();
                    }
                });
            } else {
                attrCount++; async_for_loop_callback();
            }
        },
        function (statusCode, n) {
            if (statusCode) {
                oneM2MControllerCallback(false, statusCode);
            } else {
                console.log("oneM2M resource registration is finished");
                oneM2MControllerCallback(true, statusCode);
            }
        }
    );
};

exports.registrationAE = function(count, fiwareInformation, oneM2MControllerCallback) {
    executeRegistrationAE(count, fiwareInformation, oneM2MControllerCallback);
};

exports.registrationConCin = function (count, fiwareInformation, oneM2MControllerCallback) {
    executeRegistrationConCin(count, fiwareInformation, oneM2MControllerCallback);
};