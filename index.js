var soap = require('soap');
var url = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';
//var url = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService"
//var url = "http://ec.europa.eu/taxation_customs/vies/api/checkVatPort?wsdl";
var args = {name: 'value'};

var cachedClient;


function checkVatWithCreateClient(request, cb) {
	soap.createClient(url, function(err, client) {
		if(err) {
			if(err.body.match(/INVALID_INPUT/)) {

			}

			return cb(err);
		}
		cachedClient = client;
		return checkVat(request, cb);
	});
}

function checkVat(input, cb) {
		var request = input;
		if(typeof(input) == "string") {
			var m = input.match(/^(\w\w)(.*)$/);
			request = {countryCode: m[1], vatNumber: m[2]};
		}

		if(!cachedClient)
			return checkVatWithCreateClient(request, cb);
		
		cachedClient.checkVat(request, function(err, res, raw) {
			if(err) {
				return cb(err);
			}

			var m;
			m = raw.match(/<address>((?:\s|\S)+)<\/address>/); // parsed XML output discards the newline ..
			// split address into multiple lines
			res.name = res.name[0];
			res.address = m[1].split('\n');
			res.address = res.address.filter(function(line) {
				return line.length;
			});
			cb(err, res);
		});

	}


module.exports = {
	checkVat: checkVat
};