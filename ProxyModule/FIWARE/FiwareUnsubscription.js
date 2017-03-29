/**
 * Created by JaeYoungHwang on 2017-03-15.
 */

var requestToAnotherServer = require('request');

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

            var statusCode = fiwareResponse.statusCode;

            if (statusCode == 204) {
                fiwareCallback(statusCode); // Callback method for sending QueryEntity result to FiwareController
            } else if (statusCode == 404) {
                fiwareCallback(statusCode);
            } // Status code will be added later
        } else { // For example, Request Timeout
            if(error.code === 'ETIMEDOUT')
                fiwareCallback(408);
        }
    });
};

exports.unsubFiwareDevice = function(subscriptionID, fiwareCallback) {
    unsubscriptionFiwareDevice(subscriptionID, fiwareCallback);
};