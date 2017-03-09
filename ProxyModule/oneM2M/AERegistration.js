/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');

var RegistrationExecution = function (AEName, callBackForResponse) {

    var bodyObject = bodyGenerator.AEBodyGenerator(AEName);

    requestToAnotherServer({
        url: 'http://127.0.0.1:62590/test', //yellowTurtleIP + '/mobius-yt',
        method: 'POST',
        json: true,
        headers: { // Basic AE resource structure for registration
            'Accept': 'application/json',
            'X-M2M-RI': '12345',
            'X-M2M-Origin': 'C',
            'Content-Type': 'application/vnd.onem2m-res+json; ty=2',
        },
        postData: { // contentInstance를 등록할때 필요한 payload json 구조를 작성한다.
            "contentInfo": "asdgaeg",
            "content": "asdgadg"
        }
    }, function (error, AECreateResponse, body) {
        console.log(AECreateResponse.statusCode);
        console.log(body);
        callBackForResponse();
    });
};

exports.AERegistrationExecution = function(AEName, callBackForResponse) {
    RegistrationExecution(AEName, callBackForResponse);
};