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
                var attrResult = Object.keys(deviceAttrData);

                // Adding fiware mandatory information
                var resultObject = new Object();
                resultObject.entityName = EntityName;
                resultObject.entityType = EntityType;

                // Adding fiware device parameters respectively
                for(var i = 0; i < attrResult.length; i++) {
                    var valueObject = new Object();
                    valueObject.value =  deviceAttrData[attrResult[i]].value;
                    resultObject[attrResult[i]] = valueObject;
                }
                fiwareCallback(resultObject); // Callback method for sending QueryEntity result to FiwareController
            }
        }
    });
};

exports.getFiwareDevice = function(EntityName, EntityType, fiwareCallback) {
    getDeviceInfo(EntityName, EntityType, fiwareCallback);
};