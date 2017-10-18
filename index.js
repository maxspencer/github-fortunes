'use strict';

const request = require('request');
const fs = require('fs');
const jwt = require('jsonwebtoken');

function getAuthToken() {
    var privateKey = fs.readFileSync('fortunes.private-key.pem');
    var payload = {
	iss: 6023
    };
    var options = {
	expiresIn: '1h',
	algorithm: 'RS256'
    };
    return jwt.sign(payload, privateKey, options);
}

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event, null, 2));
    request('https://uploadbeta.com/api/fortune/', function (error, response, body) {
	if (error) {
	    callback(error);
	} else {
	    var fortune = JSON.parse(body);
	    var token = getAuthToken();
            callback(error, token);
	}
    });
};
