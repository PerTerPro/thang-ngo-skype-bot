var requestPromise = require('request-promise-native');
var request = require('request');
var _ = require('lodash');
var util = require('./util');

exports.getGirlImg = function () {
  return getRandomGirlImg();
}

//----- Private function -----------

function getRandomGirlImg() {
  var a = requestPromise({
    method: 'GET',
    uri: 'https://ketnoi-28.000webhostapp.com/fl_img/index.php',
    json: true
  });

  return a;

}
