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

var subscriptionBodyGenerator = function () {
    var bodyObject = new Object();

    // Description
    bodyObject['description'] = "Fiware Device Subscription for oneM2M";

    // Making subject information
    var subjectObject = new Object();

    var subjectRoot = new Object();
    var entitiesObject = new Object();
    var entitiesArray = new Array();
    var conditionArray = new Array();

    var entity = new Object();
    entity['id'] = "example entity1";
    entity['type'] = "example type1";

    entitiesArray.push(entity);
    conditionArray.push(condition);

    var condition = new Object();
    condition['attrs'] = conditionArray;

    subjectRoot['entities'] = entitiesArray;
    subjectRoot['condition'] = conditionArray;

    bodyObject['subject'] = subjectRoot;

    // Making notification information
    var notificationObject = new Object();

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
exports.fiwareSubscriptionBodyGenerator = function () {
    return subscriptionBodyGenerator();
};