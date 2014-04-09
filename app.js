var mongoose = require('mongoose'),
	passport = require('passport'), // passport authentication
	domain = require('domain');

// expressValidator = require('express-validator'),
// errorHandler = require('express-error-handler'),

var config = require('./server/config/config.js')();

/**
 * Load database, models, routes and controllers
 */

var db = mongoose.connect(config.db.host, config.db.database);
var app = require('./server/config/system/bootstrap')(passport, db);

var serverDomain = domain.create();

serverDomain.run(function() {
	var port = process.env.PORT || config.app.port;
	app.listen(port, function() {

		console.log('Server running on port ' + port + ' in ' + config.app.environment + ' mode.');

		var reqd = domain.create();

		reqd.on('error', function(er) {
			console.error('Error', er, req.url);
			try {
				res.writeHead(500);
				res.end('Error occurred, sorry.');
			} catch (er) {
				console.error('Error sending 500', er, req.url);
			}
		});
	});
	exports = module.exports = app;
});
