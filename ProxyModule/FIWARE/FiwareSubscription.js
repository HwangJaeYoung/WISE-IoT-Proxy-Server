/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');

var getDeviceInfo = function (EntityName, EntityType, fiwareCallback) {

    var targetURL = fiwareIP + '/v2/subscriptions/';

    // Request for getting fiware device information from ContextBroker (Query Entity)
    requestToAnotherServer( { url : targetURL,
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') {
            if (fiwareResponse.statusCode == 200) {
                fiwareCallback(resultObject); // Callback method for sending QueryEntity result to FiwareController
            }
        }
    });
}

exports.getFiwareDevice = function(EntityName, EntityType, fiwareCallback) {
    getDeviceInfo(EntityName, EntityType, fiwareCallback);
};