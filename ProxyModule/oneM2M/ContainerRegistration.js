/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var async = require('async');
var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');
var contentInstanceRegistration = require('./contentInsatnceRegistration');

var RegistrationExecution = function (AEName, deviceInfo, callBackForResponse) {

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
                }, function (error, oneM2MResponse, body) {

                    if(typeof(oneM2MResponse) !== 'undefined') {

                        var statusCode = oneM2MResponse.statusCode;

                        if (statusCode == 201) {
                            var contentInstanceValue = deviceInfo[attributeKey[count]].value;
                            contentInstanceRegistration.contentInstanceRegistrationExecution(AEName, containerName, contentInstanceValue, function () {
                                count++; async_for_loop_callback();
                            });
                        } else if(statusCode == 400) {
                            async_for_loop_callback(statusCode);
                        } else if (statusCode == 409) {
                            async_for_loop_callback(statusCode);
                        } // Status code will be added later
                    } else { // For example, Request Timeout
                        if(error.code === 'ETIMEDOUT')
                            async_for_loop_callback(408);
                    }
                });
            } else {
                count++;
                async_for_loop_callback();
            }
        },
        function (statusCode, n) {
            if (statusCode) {
                callBackForResponse(statusCode);
            } else {
                callBackForResponse(201);
            }
        }
    );
};

exports.ContainerRegistrationExecution = function(AEName, deviceInfo, callBackForResponse) {
    RegistrationExecution(AEName, deviceInfo, callBackForResponse);
};