'use strict';

var BuildMail = require('buildmail');
var hashcash = require('./hashcash');

module.exports = function(options) {
    options = options || {};

    return function(mail, callback) {
        // ensure date value
        if (!mail.data.date) {
            mail.data.date = new Date();
        }

        var date = mail.data.date;
        if (Object.prototype.toString.call(date) !== '[object Date]') {
            date = new Date(date);
        }
        if (isNaN(date.getTime())) {
            date = new Date();
        }

        // ensure headers object as an array
        if (!mail.data.headers) {
            mail.data.headers = [];
        } else if (!Array.isArray(mail.data.headers)) {
            mail.data.headers = Object.keys(mail.data.headers).map(function(key) {
                return {
                    key: key,
                    value: mail.data.headers[key]
                };
            });
        }

        // get recipients list
        var builder = new BuildMail();
        ['from', 'to', 'cc', 'bcc'].forEach(function(key) {
            if (mail.data[key]) {
                builder.addHeader(key, mail.data[key]);
            }
        });
        var recipients = [].concat(builder.getEnvelope().to || []);

        // calculate hashcash values for each recipient in parallel
        var found = 0;
        recipients.forEach(function(recipient){
            hashcash(recipient, {
                bits: options.bits,
                date: date
            }, function(err, value) {
                mail.data.headers.push({
                    key: 'X-Hashcash',
                    value: value
                });
                found++;
                if (found >= recipients.length) {
                    return callback(null);
                }
            });
        });
    };
};
