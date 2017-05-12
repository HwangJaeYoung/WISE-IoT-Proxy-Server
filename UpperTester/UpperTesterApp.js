/**
 * Created by JaeYoungHwang on 2017-05-13.
 */

var upperTester = function (app) {
    app.post('/UpperTesterEntry', function (request, response) {

        // Parsing the triggering message

        response.send('<h1>'+ 'WISE-IoT' + '</h1>');
    });
};

exports.upperTesterStart = function(app) {
    upperTester(app);
};