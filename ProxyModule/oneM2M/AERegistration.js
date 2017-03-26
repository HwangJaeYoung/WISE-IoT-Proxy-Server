/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');

var RegistrationExecution = function (AEName, callBackForResponse) {

    var bodyObject = bodyGenerator.AEBodyGenerator(AEName);
    var targetURL = yellowTurtleIP + '/mobius-yt';

    requestToAnotherServer({
        url: targetURL,
        method: 'POST',
        json: true,
        headers: { // Basic AE resource structure for registration
            'Accept': 'application/json',
            'X-M2M-RI': '12345',
            'X-M2M-Origin': 'C',
            'Content-Type': 'application/vnd.onem2m-res+json; ty=2'
        },
        body: bodyObject
    }, function (error, AECreateResponse, body) {
        callBackForResponse();
    });
};

exports.AERegistrationExecution = function(AEName, callBackForResponse) {
    RegistrationExecution(AEName, callBackForResponse);
};