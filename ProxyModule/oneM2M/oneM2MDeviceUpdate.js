/**
 * Created by JaeYoungHwang on 2017-03-08.
 */

var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');

var UpdateExecution = function (AEName, containerName, contentInstanceValue, callBackForResponse) {

    var targetURL = yellowTurtleIP + '/mobius-yt/' + AEName + "/" + containerName;
    var bodyObject = bodyGenerator.contentInstanceBodyGenerator(contentInstanceValue);

    requestToAnotherServer({
        url: targetURL,
        method: 'POST',
        json: true,
        headers: { // Basic AE resource structure for registration
            'Accept': 'application/json',
            'X-M2M-RI': '12345',
            'X-M2M-Origin': 'Origin',
            'Content-Type': 'application/vnd.onem2m-res+json; ty=4',
        },
        body: bodyObject
    }, function (error, AECreateResponse, body) {
        callBackForResponse();
    });
};

exports.fiwareChangedDataUpdateExecution = function(AEName, containerName, contentInstanceValue, callBackForResponse) {
    UpdateExecution(AEName, containerName, contentInstanceValue, callBackForResponse);
};