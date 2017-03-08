/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');
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

            if (attributeKey[count] !== 'entityName' && attributeKey[count] !== 'entityType') {
                var targetURL = yellowTurtleIP + '/mobius-yt/' + AEName;
                var containerName = attributeKey[count];

                requestToAnotherServer({
                    url: targetURL,
                    method: 'POST',
                    json: true,
                    headers: { // Basic AE resource structure for registration
                        'Accept': 'application/json',
                        'X-M2M-RI': '12345',
                        'X-M2M-Origin': 'Origin',
                        'Content-Type': 'application/vnd.onem2m-res+json; ty=2',
                    },
                    body: { // NGSI10에 따른 payload이 구성이다.(queryContext)
                        'App-ID': "0.2.481.2.0001.001.000111"
                    }
                }, function (error, AECreateResponse, body) {
                    var contextInstanceValue = deviceInfo[attributeKey[count]].value;
                    contentInstanceRegistration.contentInstanceRegistrationExecution(AEName, containerName, contextInstanceValue, function () {
                        count++;
                        async_for_loop_callback();
                    });
                });
            }
        },
        function (err, n) {
            if (err) {
                console.log(err);
            } else {
                callBackForResponse();
            }
        }
    );
};

exports.ContainerRegistrationExecution = function(AEName, deviceInfo, callBackForResponse) {
    RegistrationExecution(AEName, deviceInfo, callBackForResponse);
};