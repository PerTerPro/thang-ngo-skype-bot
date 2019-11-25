var requestPromise = require('request-promise-native');
var request = require('request');
var _ = require('lodash');
var util = require('./util');

exports.getGirlImg = function () {
  return getRandomGirlImg();
}

//----- Private function -----------

function getRandomGirlImg(count) {  
  var a = requestPromise({
    method: 'GET',
    uri: 'http://www.girl-img.somee.com/api/girl-img/get-image',
    json: true
  });

  return a;
}
