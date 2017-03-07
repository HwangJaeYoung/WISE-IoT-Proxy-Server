/**
 * Created by JaeYoungHwang on 2017-03-07.
 */

// extract the modules
var async = require('async');
var requestToAnotherServer = require('request');
var getFiwareDevice = require('./FIWARE/FiwareQueryEntity');

var executeQueryEntity = function(fiwareCallback) {

    var count = 0;
    var deviceLists = 0;
    var fiwareDevices = [];

    async.whilst(
        function () { return count < deviceLists; },

        function (async_for_loop_callback) {
            count++;
            GetFiwareDeviceInfo.executeQueryEntity(function(responseObject) {
                var resultObj = request.body;
                var requestInfoObject = resultObj['requestInfo'];
                fiwareDevices[count] = '';
            });
            async_for_loop_callback(null, count);
        },
        function (err, n) {
            fiwareCallback(fiwareDevices);
        }
    );
};

exports.QueryEntity = function(fiwareCallback) {
    executeQueryEntity(fiwareCallback);
};