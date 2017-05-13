/**
 * Created by JaeYoungHwang on 2017-05-13.
 */

var AERegistartion = require('../ProxyModule/oneM2M/AERegistration');
var ContainerRegistartion = require('../ProxyModule/oneM2M/ContainerRegistration');
var contentInstanceRegistartion = require('../ProxyModule/oneM2M/contentInsatnceRegistration');

var upperTester = function (app) {
    app.post('/UpperTesterEntry', function (request, response) {

        // Parsing the triggering message
        var requestPrimitive = request.body['rqp']; // Root
        var op = requestPrimitive['op'];
        var ty = requestPrimitive['ty'];
        var to = requestPrimitive['to'];
        var pc = requestPrimitive['pc'];

        // AE functionalities
        if (pc['m2m:ae']) {
            if (op == '1') { // POST, AE reginstration
                AERegistartion.CallAERegistrationFunction('Wise-IoT', function (statusCode) {
                    if(statusCode == '201') {
                        response.statusCode('201').send('AE Creation Success');
                    }
                });
            } else if (op == '2') {
                // GET Operation
            } else if (op == '3') {
                // Update Operation
            } else if (op == '4') {
                // Delete Operation
            }
        }

        // Container
        if(pc['m2m:cnt']) {

        }

        response.send('<h1>'+ 'WISE-IoT' + '</h1>');
    });
};

exports.upperTesterStart = function(app) {
    upperTester(app);
};