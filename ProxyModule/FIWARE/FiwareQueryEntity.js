/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');

var gettingDeviceInfo = function (EntityName, EntityType, fiwareCallback) {

    var targetURL = fiwareIP + '/v2/entities/' + EntityName + '/' + 'attrs' + '?' + 'type=' + EntityType;

    // Request for getting fiware device information from ContextBroker (Query Entity)
    requestToAnotherServer( { url : targetURL,
        method : 'GET',
        headers : {
            'Accept' : 'application/json'
        }
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') {

            var statusCode = fiwareResponse.statusCode;

            if (statusCode == 200) { // request retrieve success
                var deviceAttrData = JSON.parse(fiwareResponse.body);
                var attrResult = Object.keys(deviceAttrData);

                // Adding Fiware mandatory information
                var resultObject = new Object();
                resultObject.entityName = EntityName;
                resultObject.entityType = EntityType;

                // Adding fiware device parameters respectively
                for(var i = 0; i < attrResult.length; i++) {
                    var valueObject = new Object();
                    valueObject.value =  deviceAttrData[attrResult[i]].value;
                    resultObject[attrResult[i]] = valueObject;
                }
                fiwareCallback(statusCode, resultObject); // Callback method for sending QueryEntity result to FiwareController
            } else if (statusCode == 404) { // resource not found
                fiwareCallback(statusCode, null);
            } // Status code will be added later
        } else { // For example, Request Timeout
            if(error.code === 'ETIMEDOUT') // request timeout
                fiwareCallback(408, null);
        }
    });
};

exports.getFiwareDevice = function(EntityName, EntityType, fiwareCallback) {
    gettingDeviceInfo(EntityName, EntityType, fiwareCallback);
};