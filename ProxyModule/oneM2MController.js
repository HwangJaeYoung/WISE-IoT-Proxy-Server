/**
 * Created by JaeYoungHwang on 2017-02-28.
 */

// extract the modules
var async = require('async');
var requestToAnotherServer = require('request');
var getFiwareDevice = require('./FIWARE/FiwareQueryEntity');

var registrationFiwareToOneM2M = function(fiwareInformation){

    // var entityName = fiwareInfo.getEntityName( );
    // var entityType = fiwareInfo.getEntityType( );

    // AEName = entityName[AECount];
    // AEType = entityType[AECount];

    /*
    var count = 0;
    var deviceLists = 3;

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            count++;

            async_for_loop_callback(null, count);
        },
        function (err, n) {

        }
    ); */

    async.waterfall([
        // Get Fiware device information
        function(fiwareCallback){
            getFiwareDevice.GetFiwareDeviceInfo(fiwareCallback);
        },
        function(arg1, arg2, callback){

            console.log("Testing : " + arg1 + arg2);
        },

        // Subscription Phase
        function(arg1, callback){
            callback(null, '끝');
        }
    ], function (err, result) {

    });
};

exports.fiwareDeviceRegistration = function(fiwareInformation) {
    registrationFiwareToOneM2M(fiwareInformation);
};