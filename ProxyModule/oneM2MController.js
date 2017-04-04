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

    // Creating AE name using Entity Name and Entity Type.
    var AEName = deviceInfo[Object.keys(deviceInfo)[count]].entityName + ":" + deviceInfo[Object.keys(deviceInfo)[count]].entityType;

    async.whilst(
        function () {
            return attrCount < attributeCount;
        },

        function (async_for_loop_callback) {

            async.waterfall([

                // Container Registration
                function(callbackForOneM2M){
                    oneM2MController.registrationContainer(count, deviceInfo, function (requestResult, statusCode) {

                    });
                },

                // contentInstance Registration
                function(detailFiwareDeviceInfo, resultCallback) {
                    oneM2MController.registrationContentInstance(count, detailFiwareDeviceInfo, function (requestResult, statusCode) {

                    });
                }
            ], function (statusCode, result) { // response to client such as web or postman

            });
        },
        function (statusCode, n) {

        }
    );
};

exports.registrationAE = function(count, fiwareInformation, oneM2MControllerCallback) {
    executeRegistrationAE(count, fiwareInformation, oneM2MControllerCallback);
};

exports.registrationConCin = function (count, fiwareInformation, oneM2MControllerCallback) {
    executeRegistrationConCin(count, fiwareInformation, oneM2MControllerCallback);
};