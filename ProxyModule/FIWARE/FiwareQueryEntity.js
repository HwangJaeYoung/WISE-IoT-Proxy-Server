/**
 * Created by JaeYoungHwang on 2017-03-03.
 */

var requestToAnotherServer = require('request');

var getDeviceInfo = function (EntityName, EntityType, fiwareCallback) {

    console.log(EntityName + " : " + EntityType);
    fiwareCallback();

    /*// Request for getting fiware device information from ContextBroker (Query Entity)
    requestToAnotherServer( { url :  'http://192.168.136.129:1026' + '/v2/entities/' + 'Room1' + '/' + 'attrs' + '?' + 'type=' + 'Room',
        method : 'GET',
        headers : {
            'Accept' : 'application/json',
        }
    }, function (error, fiwareResponse, body) {
        if(typeof(fiwareResponse) !== 'undefined') { // fiware에서 응답이 왔을 경우에는 다음을 수행한다.
            if (fiwareResponse.statusCode == 200) {

                var deviceAttrData = JSON.parse(fiwareResponse.body);
                var result = Object.keys(deviceAttrData);

                for (var i = 0; i < result.length; i++) {
                    console.log(result[i]);
                }
            }
            fiwareCallback(null, '하나', '둘');
        }
    });*/
}

exports.getFiwareDevice = function(EntityName, EntityType, fiwareCallback) {
    getDeviceInfo(EntityName, EntityType, fiwareCallback);
};