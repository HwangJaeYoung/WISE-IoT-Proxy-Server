/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var async = require('async');
var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');
var contentInstanceRegistration = require('./contentInsatnceRegistration');

var RegistrationExecution = function (AEName, deviceInfo, callBackForResponse) {

    var selectedDevices = fiwareInformation['FiwareDevices']; // Root
    var deviceInfo = selectedDevices.deviceInfo;

    var count = 0;
    var attributeKey = Object.keys(deviceInfo);
    var attributeCount = attributeKey.length;

    async.whilst(
        function () {
            return count < attributeCount;
        },

        function (async_for_loop_callback) {

            if ((attributeKey[count] == 'entityName' || attributeKey[count] == 'entityType') == false) {
                var targetURL = yellowTurtleIP + '/mobius-yt/' + AEName;
                var containerName = attributeKey[count];
                var bodyObject = bodyGenerator.ContainerBodyGenerator(containerName);

                requestToAnotherServer({
                    url: targetURL,
                    method: 'POST',
                    json: true,
                    headers: { // Basic AE resource structure for registration
                        'Accept': 'application/json',
                        'X-M2M-RI': '12345',
                        'X-M2M-Origin': 'Origin',
                        'Content-Type': 'application/vnd.onem2m-res+json; ty=3',
                    },
                    body: bodyObject
                }, function (statusCode, n) {
                    if (statusCode) {
                        callBackForResponse(statusCode);
                    } else {
                        callBackForResponse(201);
                    }
                });
            }
        }
    );
};

exports.ContainerRegistrationExecution = function(AEName, deviceInfo, callBackForResponse) {
    RegistrationExecution(AEName, deviceInfo, callBackForResponse);
};