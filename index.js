'use strict';

const request = require('request');

exports.handler = (event, context, callback) => {
    request('https://uploadbeta.com/api/fortune/', function (error, response, body) {
        callback(error, JSON.parse(body));
    });
};
