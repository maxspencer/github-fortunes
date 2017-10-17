'use strict';

const https = require('https');

exports.handler = (event, context, callback) => {
    https.get('https://uploadbeta.com/api/fortune/', function (res) {
        if (res.statusCode !== 200) {
            callback(res.statusMessage);
        } else {
            res.on('data', function (data) {
                console.log('Data: ', data);
            });
            res.on('end', function () {
                callback(null, null);
            })
        }
    });
};
