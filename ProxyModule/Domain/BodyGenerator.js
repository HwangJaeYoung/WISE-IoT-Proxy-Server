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

    return bodyObject;
};

var ContainerBodyGeneration = function (ContainerName) {
    var bodyObject = new Object();

    var rootForAttr = new Object();
    rootForAttr['rn'] = ContainerName;
    bodyObject['m2m:cnt'] = rootForAttr;

    return bodyObject;
};

var contentInstanceBodyGeneration = function (contentInstanceName) {
    var bodyObject = new Object();

    var rootForAttr = new Object();
    rootForAttr['con'] = contentInstanceName;
    bodyObject['m2m:cin'] = rootForAttr;

    return bodyObject;
};

// oneM2M Body Generator
exports.AEBodyGenerator = function(AEName) {
    return AEBodyGeneration(AEName);
};

exports.ContainerBodyGenerator = function(containerName) {
    return ContainerBodyGeneration(containerName);
};

exports.contentInstanceBodyGenerator = function(contentInstanceValue) {
    return contentInstanceBodyGeneration(contentInstanceValue);
};

// FIWARE Body Generator




