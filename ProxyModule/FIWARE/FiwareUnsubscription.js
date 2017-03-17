/**
 * Created by JaeYoungHwang on 2017-03-15.
 */

var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');

var unsubscriptionFiwareDevice = function (subscriptionID, fiwareCallback) {

    var targetURL = fiwareIP + '/v2/subscriptions/' + subscriptionID;

    // Request for subscribing fiware device information from ContextBroker (Subscription Entity)
    requestToAnotherServer( { url : targetURL,
        method : 'DELETE',
        headers : {
            'Accept' : 'application/json',
        },
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') {
            if (!error && fiwareResponse.statusCode == 204) {
                fiwareCallback();
            } else {
                fiwareCallback();
            }
        }
    });
};

exports.unsubFiwareDevice = function(subscriptionID, fiwareCallback) {
    unsubscriptionFiwareDevice(subscriptionID, fiwareCallback);
};