var requestPromise = require('request-promise-native');
var request = require('request');
var _ = require('lodash');
var util = require('./util');

exports.getGirlImg = function (count) {
  return getRandomGirlImg(count);
}

//----- Private function -----------

function getRandomGirlImg(count) {  
  var lst = requestPromise({
    method: 'GET',
    uri: 'http://www.girl-img.somee.com/api/girl-img/get-image?count=' + count,
    json: true
  });

  return lst;
}
