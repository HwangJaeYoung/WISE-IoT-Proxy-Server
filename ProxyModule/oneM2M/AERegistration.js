/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');

var AERegistrationExecution = function () {
    requestToAnotherServer({
        url: yellowTurtleIP + '/mobius-yt',
        method: 'POST',
        json: true,
        headers: { // Mobius에 AE등록을 위한 기본 헤더 구조
            'Accept': 'application/json',
            'locale': 'ko',
            'X-M2M-RI': '12345',
            'X-M2M-Origin': 'Origin',
            'X-M2M-NM': AEName,
            'content-type': 'application/vnd.onem2m-res+json; ty=2',
            'nmtype': 'long'
        },
        body: { // NGSI10에 따른 payload이 구성이다.(queryContext)
            'App-ID': "0.2.481.2.0001.001.000111"
        }
    }, function (error, AECreateResponse, body) {

    });
};

exports.AERegistration = function(aeRegistrationCallback) {
    AERegistrationExecution(aeRegistrationCallback);
};