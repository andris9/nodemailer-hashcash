'use strict';

var chai = require('chai');
var hashcash = require('../lib/nodemailer-hashcash');

var expect = chai.expect;
chai.Assertion.includeStack = true;

describe('nodemailer-hashcash tests', function() {
    this.timeout(10000);
    it('should set hashcash header', function(done) {
        var plugin = hashcash({bits: 8});
        var mail = {
            data: {
                to:'receiver@example.com'
            }
        };
        plugin(mail, function(err) {
            expect(err).to.not.exist;
            expect(mail.data.headers.length).to.equal(1);
            expect(mail.data.headers[0].key).to.equal('X-Hashcash');
            expect(/^1:8:\d+:receiver@example.com::[\w+=\/]+:\w+$/.test(mail.data.headers[0].value)).to.be.true;
            done();
        });
    });
});
