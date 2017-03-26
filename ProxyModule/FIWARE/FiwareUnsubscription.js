/**
 * Created by JaeYoungHwang on 2017-03-15.
 */

var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');

var unsubscriptionFiwareDevice = function (subscriptionID, fiwareCallback) {

    var targetURL = fiwareIP + '/v2/subscriptions/' + subscriptionID;

    // Unsubscribing fiware devices
    requestToAnotherServer( { url : targetURL,
        method : 'DELETE',
        headers : {
            'Accept' : 'application/json',
        },
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') {
            if (!error && fiwareResponse.statusCode == 204) {
                fiwareCallback(true); // Success
            } else {
                fiwareCallback(false); // Fail
            }
        } else { // fiwareRespond has undefined
            fiwareCallback(false); // Fail
        }
    });
};

exports.unsubFiwareDevice = function(subscriptionID, fiwareCallback) {
    unsubscriptionFiwareDevice(subscriptionID, fiwareCallback);
};