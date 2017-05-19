/**
 * Created by JaeYoungHwang on 2017-05-13.
 */

var AERegistartion = require('../ProxyModule/oneM2M/AERegistration');
var ContainerRegistartion = require('../ProxyModule/oneM2M/ContainerRegistration');
var contentInstanceRegistartion = require('../ProxyModule/oneM2M/contentInsatnceRegistration');

var upperTester = function (app) {
    app.post('/UpperTesterEntry', function (request, response) {

        var op = request.body['op'];
        var ty = request.body['ty'];
        var to = request.body['to'];

        // AE functionalities
        if (ty == '2') {
            if (op == '1') { // POST, AE registration
                AERegistartion.CallAERegistrationFunction('Wise-IoT', function (statusCode) {
                    if(statusCode == 201) {
                        console.log("request finish");
                        response.send('<h1>' + 'WISE-IoT' + '</h1>');
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
        if(ty =='3') {
            if (op == '1') { // POST, Container registration
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

        // contentInstance
        if(ty=='4') {
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
    });
};

exports.upperTesterStart = function(app) {
    upperTester(app);
};