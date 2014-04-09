var should = require('should'),
	app = require('../app'),
	users = require('../server/controllers/users'),
	request = require('supertest');

describe('Creating a user', function() {
	it('should create and store a user in the database using the route', function(done) {

		// make the request to the route with the user data
		request(app)
			.post('/panel/users/create')
			.send({
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@gmail.com',
				username: 'johndoe',
				password: 'johndoe',
				confirmPassword: 'johndoe',
				role: 0
			})
			.expect(200)
			.end(function(err, res) {
				var createdUser = res.body.user;
				if (err) {
					throw err;
				}

				// check that the created user exists
				users.findById(createdUser._id, function(err, user) {
					if (err) {
						throw err;
					}
					if (JSON.stringify(createdUser) !== JSON.stringify(user)) {
						console.log(createdUser);
						console.console.log(user);
						throw new Error('The user in the database and the user created are not the same.');
					}

					done();
				});
			});
	});
});