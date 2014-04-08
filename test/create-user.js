var should = require('should'),
	app = require('../app'),
	users = require('../server/controllers/users'),
	request = require('supertest');

describe('creating a user', function() {
	it('should create and store a user in the database using the controller method', function(done) {
		console.log(app);
		var app = app();
		users.create(req, res, callback);
		request(app)
			.get('/panel/users/create')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
			});
	});
});
