var should = require('should'),
	app = require('../app'),
	users = require('../server/controllers/users'),
	request = require('supertest');

var testUserID;

describe('Accessing the users page', function() {
	it('should successfully GET the users page', function(done) {

		// post the request to the route with the user data
		request(app)
			.get('/panel/users')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				done();
				});
			});
	});
});

describe('Creating a user', function() {
	it('should create and store a user in the database using the route', function(done) {

		// post the request to the route with the user data
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
				testUserID = createdUser.id;

				if (err) {
					throw err;
				}

				// check that the created user exists
				users.findById(createdUser.id, function(err, user) {
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

describe('Removing a user', function() {
	it('should remove and an existing user from the database using the route', function(done) {

		// make the request to the route to delete the user
		request(app)
			.del('/panel/users/' + testUserID)
			.expect(200)
			.end(function(err, res) {
				// check that the created user exists
				users.findById(testUserID, function(err, user) {
					if (!err) {
						// a user could be found, so it wasn't removed
						throw new Error('The user was not removed properly.');
					}
					done();
				});
			});
	});
});
