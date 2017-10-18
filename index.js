'use strict';

const request = require('request');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const userAgent = 'GitHub Fortunes';

function createJwt() {
    console.log('Creating JWT...');
    var privateKey = fs.readFileSync('fortunes.private-key.pem');
    var payload = {
	iss: 6023
    };
    var options = {
	expiresIn: 10 * 60,
	algorithm: 'RS256'
    };
    return jwt.sign(payload, privateKey, options);
}

function asInstallation(installationId, callback) {
    var url = 'https://api.github.com/installations/:installation_id/access_tokens'.replace(
	':installation_id',
	installationId.toString()
    );
    var jwt = createJwt();
    console.log('Authenticating as installation...');
    request({
	url: url,
	method: 'POST',
	headers: {
	    Accept: 'application/vnd.github.machine-man-preview+json',
	    Authorization: 'Bearer ' + jwt,
	    'User-Agent': userAgent
	}
    }, function(error, response, body) {
	if (error) {
	    callback(error);
	} else if (response.statusCode != 201) {
	    callback(body);
	} else {
	    callback(null, JSON.parse(body).token);
	}
    });
}

exports.handler = (event, context, callback) => {
    //console.log(JSON.stringify(event, null, 2));
    request('https://uploadbeta.com/api/fortune/', function (error, response, body) {
	if (error) {
	    callback(error);
	} else {
	    var fortune = JSON.parse(body);
	    var commentsUrl = event.pull_request.comments_url;
	    asInstallation(event.installation.id, function (error, token) {
		if (error) {
		    callback(error);
		} else {
		    console.log('Posting fortune...');
		    request({
			url: commentsUrl,
			method: 'POST',
			body: JSON.stringify({
			    body: fortune
			}),
			headers: {
			    Accept: 'application/vnd.github.machine-man-preview+json',
			    Authorization: 'token ' + token,
			    'User-Agent': userAgent
			}
		    }, function (error, response, body) {
			if (error) {
			    callback(error);
			} else if (response.statusCode != 201) {
			    callback(response);
			} else {
			    callback(null, response);
			}
		    });
		}
	    });
	}
    });
};
