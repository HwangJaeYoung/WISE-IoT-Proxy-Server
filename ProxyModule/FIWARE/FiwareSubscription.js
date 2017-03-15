/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');
var bodyGenerator = require('../Domain/BodyGenerator');

var subscriptionFiwareDevice = function (entityName, entityType, deviceInfo, fiwareCallback) {

    var targetURL = fiwareIP + '/v2/subscriptions/';
    var bodyObject = bodyGenerator.fiwareSubscriptionBodyGenerator(entityName, entityType, deviceInfo);

    // Request for subscribing fiware device information from ContextBroker (Subscription Entity)
    requestToAnotherServer( { url : targetURL,
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: bodyObject
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') {
            if (fiwareResponse.statusCode == 200) {



                fiwareCallback(resultObject); // Callback method for sending entity subscription result to FiwareController
            }
        }
    });
};

exports.subFiwareDevice = function(entityName, entityType, deviceInfo, fiwareCallback) {
    subscriptionFiwareDevice(entityName, entityType, deviceInfo, fiwareCallback);
};