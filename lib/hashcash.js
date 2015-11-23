'use strict';

var crypto = require('crypto');

/**
 * Generates a hashcash string
 *
 * @param  {String}   resource A string value to mint into hashcash format
 * @param  {Object}   [options] Includes two options: `bits` (defaults to 20) and `date`
 * @param  {Function} callback Return an error or an hashcash string
 */
module.exports = function(resource, options, callback) {
    if (!callback && typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    options = options || {};

    var bits = options.bits || 20;

    var date = options.date || new Date();
    if (Object.prototype.toString.call(date) === '[object Date]') {
        if (isNaN(date.getTime())) {
            date = new Date();
        }
        date = date.toISOString().substr(2, 17).replace(/[^\d]/g, '');
    } else {
        date = (date || '').toString();
    }

    var nonce = crypto.randomBytes(12).toString('base64');
    var bytes = Math.ceil(bits / 8);
    var match = new Array(bytes + 1).join('\x00');
    var prefix = ['1', bits, date, resource, '', nonce, ''].join(':');
    var counter = 0;
    var batch = 1000;

    var gen = function() {
        for (var i = 0; i < batch; i++) {
            var hash = crypto.createHash('sha1').update(prefix + counter.toString(16)).digest('binary');
            if (hash.substr(0, bytes) === match) {
                return callback(null, prefix + counter.toString(16));
            }
            counter++;
        }
        setImmediate(gen);
    };
    setImmediate(gen);
};
