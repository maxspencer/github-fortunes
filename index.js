'use strict';

const request = require('request');

exports.handler = (event, context, callback) => {
    request('https://uploadbeta.com/api/fortune/', function (error, response, body) {
	if (error) {
	    callback(error);
	} else {
	    var fortune = JSON.parse(body);
            callback(error, fortune);
	}
    });
};
