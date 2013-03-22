var euVies = require("./index");

var assert = require('assert');

describe("require('euvies')", function() {

	it('should work with object request', function(done) {
		euVies.checkVat({countryCode: "PL", vatNumber: "5842656844"}, function(err, res) {
			if(err) {
				return done(err);
			}
			if(res.name == "DAMIAN KACZMAREK")
				done();
		});
	});

	it('should work with string request', function(done) {
		euVies.checkVat("GB706241857", function(err, res) {
			if(err) {
				return done(err);
			}
			done();
		});
	});
	it('should fail with bad country code', function(done) {
			euVies.checkVat("GZ706241857", function(err, res) {
				if(err)
					return done();
				done(res);
			});
	});

	it('should not validate with bad VAT ID', function(done) {

			euVies.checkVat("GB706857", function(err, res) {
				if(err)
					return done(err);
				if(res.valid === false)
					return done();
				done(res);
			});
	});

	it('should fail with undefined input', function(done) {
			euVies.checkVat(undefined, function(err, res) {
				if(err)
					return done();
				done(res);
			});
	});

});