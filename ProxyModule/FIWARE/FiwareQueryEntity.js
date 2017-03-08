/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');

var getDeviceInfo = function (EntityName, EntityType, fiwareCallback) {

    var targetURL = fiwareIP + '/v2/entities/' + EntityName + '/' + 'attrs' + '?' + 'type=' + EntityType;

    // Request for getting fiware device information from ContextBroker (Query Entity)
    requestToAnotherServer( { url : targetURL,
        method : 'GET',
        headers : {
            'Accept' : 'application/json',
        }
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') {
            if (fiwareResponse.statusCode == 200) {

                var deviceAttrData = JSON.parse(fiwareResponse.body);
                var result = Object.keys(deviceAttrData);
                fiwareCallback(result); // Callback method for sending QueryEntity result to FiwareController
            }
        }
    });
}

exports.getFiwareDevice = function(EntityName, EntityType, fiwareCallback) {
    getDeviceInfo(EntityName, EntityType, fiwareCallback);
};