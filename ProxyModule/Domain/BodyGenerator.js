/**
 * Created by JaeYoungHwang on 2017-03-08.
 */

var AEBodyGeneration = function (AEName) {
    var bodyObject = new Object();

    var rootForAttr = new Object();
    rootForAttr['api'] = "0.2.481.2.0001.001.000111";
    rootForAttr['rr'] = "true";
    rootForAttr['rn'] = AEName;

    bodyObject['m2m:ae'] = rootForAttr;

    return JSON.stringify(bodyObject);
};

var ContainerBodyGeneration = function (AEName, callBackForResponse) {

};

var contentInstanceBodyGeneration = function (AEName, callBackForResponse) {

};

exports.AEBodyGenerator = function(AEName) {
    return AEBodyGeneration(AEName);
};

exports.ContainerBodyGenerator = function(AEName, containerName, contentInstanceValue, callBackForResponse) {
    ContainerBodyGeneration(AEName, containerName, contentInstanceValue, callBackForResponse);
};

exports.contentInstanceBodyGenerator = function(AEName, containerName, contentInstanceValue, callBackForResponse) {
    contentInstanceBodyGeneration(AEName, containerName, contentInstanceValue, callBackForResponse);
};