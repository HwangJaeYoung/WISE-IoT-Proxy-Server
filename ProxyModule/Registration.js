/**
 * Created by JaeYoungHwang on 2017-02-28.
 */

// extract the modules
var async = require('async');
var requestToAnotherServer = require('request');

var registrationFiwareToOneM2M = function(fiwareInfo){

    // var entityName = fiwareInfo.getEntityName( );
    // var entityType = fiwareInfo.getEntityType( );

    // AEName = entityName[AECount];
    // AEType = entityType[AECount];

    async.waterfall([
        // Get Fiware device information
        function(callback){
            // Request for getting fiware device information from ContextBroker (Query Entity)
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
                    callback(null, '하나', '둘');
                }
            });
        },
        function(arg1, arg2, callback){
            console.log(arg1, arg2);
            // arg1는 '하나'고, arg2는 '둘'이다.
            callback(null, '셋');
        },
        function(arg1, callback){
            // arg1은 '셋'이다.
            callback(null, '끝');
        }
    ], function (err, result) {



        // result에는 '끝'이 담겨 온다.
    });


};

exports.fiwareDeviceRegistration = function(fiwareInfo) {
    registrationFiwareToOneM2M(fiwareInfo);
};