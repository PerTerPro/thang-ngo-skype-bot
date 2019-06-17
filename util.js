// stringFormat | Ex: stringFormat('Count: {0} | Items: {1}', 10, 'ABC');           
exports.stringFormat = function (text) {
    if (arguments.length <= 1) {
        return text;
    }
    var tokenCount = arguments.length - 2;
    for (var token = 0; token <= tokenCount; token++) {
        text = text.replace(new RegExp("\\{" + token + "\\}", "gi"), arguments[token + 1]);
    }
    return text;
};