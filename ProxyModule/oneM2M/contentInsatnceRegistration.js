/**
 * Created by JaeYoungHwang on 2017-03-08.
 */

var requestToAnotherServer = require('request');

var RegistrationExecution = function (AEName, containerName, contentInstanceValue, callBackForResponse) {

    var targetURL = yellowTurtleIP + '/mobius-yt/' + AEName + "/" + containerName;

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
        callBackForResponse();
    });
};

exports.contentInstanceRegistrationExecution = function(AEName, containerName, contentInstanceValue, callBackForResponse) {
    RegistrationExecution(AEName, containerName, contentInstanceValue, callBackForResponse);
};