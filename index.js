'use strict';

const request = require('request');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
    request('https://uploadbeta.com/api/fortune/', function (error, response, body) {
	if (error) {
	    callback(error);
	} else {
	    var fortune = JSON.parse(body);
	    var privateKey = fs.readFileSync('fortunes.private-key.pem');
	    var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
            callback(error, token);
	}
    });
};
