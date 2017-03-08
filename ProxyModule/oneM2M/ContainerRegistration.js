/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');

var RegistrationExecution = function (AEName, callBackForResponse) {

    requestToAnotherServer({
        url: yellowTurtleIP + '/mobius-yt',
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

exports.ConCinRegistration = function(getFiwareCallback) {
    containerRegistrationExecution(getFiwareCallback);
};