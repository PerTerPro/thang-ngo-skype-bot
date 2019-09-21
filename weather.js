// exports.myDateTime = function () {
//   return Date();
// };

var requestPromise = require('request-promise-native');
var request = require('request');
var _ = require('lodash');
var util = require('./util');

const moment = require('moment-timezone');
const timeZone = "Asia/Ho_Chi_Minh";

const _openWeatherMapApiKey = '744c5d27ac644b5925dbe5c3b1018222';

const locationIds = [
  1581129,       //Thủ đô Hà Nội
  1580578         //Thành Phố Hồ Chí Minh
];

exports.getWeather = function () {
  return Promise
    .all(_.map(locationIds, function(location) {
      return getWeatherFromOpenWeatherMap(location)
        .then(function(data) {
          return renderWeatherMessage(data);
        });
    }))
    .then(function(results) {
      return results.join('');
    });
}



//----- Private function -----------

function renderWeatherMessage(model) {
  var msg = '';
  msg += util.stringFormat('**Thời tiết {0}** {1}: \n', model.name, moment().tz(timeZone).format('DD/MM/YYYY - HH:mm'));
  msg += (model.main.temp_min == model.main.temp_max) ?
    'Nhiệt độ hiện tại: **' + model.main.temp + '°C** \n' :
    'Nhiệt độ từ **' + model.main.temp_min + '** tới **' + model.main.temp_max + '°C** \n';
  msg += 'Đổ ẩm: **' + model.main.humidity + '%** \n';
  msg += 'Gió giật: **' + model.wind.speed * 3600 / 1000 + ' km/h** \n';

  for (var i = 0; i < model.weather.Count; i++) {
    msg += convertWeather(model.weather[i].description) +
      ((i != model.weather.Count - 1) ? ' - ' : '\n');
  }
  return msg;
}

function convertWeather(description) {
  switch (description) {
    case 'clear sky':
      description = 'Trời quang đãng';
      break;
    case 'few clouds':
      description = 'Trời ít mây';
      break;
    case 'scattered clouds':
      description = 'Mây rải rác';
      break;
    case 'broken clouds':
      description = 'Trời nhiều mây';
      break;
    case 'light rain':
      description = 'Mưa nhỏ';
      break;
    case 'shower rain':
      description = 'Mưa rào';
      break;
    case 'rain':
      description = 'Có Mưa';
      break;
    case 'thunderstorm':
      description = 'Dông gió';
      break;
    case 'snow':
      description = 'Xuất hiện tuyết rơi';
      break;
    case 'mist':
      description = 'Sương mù';
      break;
  }
  return description;
}

function getWeatherFromOpenWeatherMap(location) {
  // var options = {
  //   method: 'GET',
  //   uri: 'http://api.openweathermap.org/data/2.5/weather',
  //   qs:
  //   {
  //     id: location,
  //     appid: _openWeatherMapApiKey,
  //     lang: 'en',
  //     units: 'metric'
  //   }
  // };
  var a = requestPromise({
    method: 'GET',
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
      id: location,
      appid: _openWeatherMapApiKey,
      lang: 'en',
      units: 'metric'
    },
    json: true
  });

  return a;


  // Sử dụng request
  // return new Promise(function(resolve, reject) {
  //   request(options, function (error, response, body) {
  //     if (error) {
  //       reject(error);
  //     }
  //     else {
  //       try {
  //         const data = JSON.parse(body);
  //         resolve(data);
  //       }
  //       catch (e) {
  //         reject(e);
  //       }
  //     }
  //   });
  // });

}
