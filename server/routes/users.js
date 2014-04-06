'use strict';

var config = require('../config/config')();

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app, passport) {

	app.get(config.routes.admin.users.url, function(req, res, next) {
		users.getAll(req, res, next, function(users) {
			res.render(config.routes.admin.users.page, {
				locals: {
					title: config.routes.admin.users.locals.title,
					users: users
				}
			});
		});
	});

	app.get('/panel/logout', users.signout);
	// app.get('/panel/users/me', users.me);

	// Setup up the users api
	app.post('/panel/users/create', users.create);

	// Setup the userId param
	app.param('userId', users.user);

	// Route to check if user is authenticated
	app.get('/panel/loggedin', function(req, res) {
		res.send(req.isAuthenticated() ? req.user.name : '0');
	});

	app.del('/panel/users/:id', function(req, res) {
		res.json({
			"success": true
		});
	});

	// Setting the local strategy route
	app.post('/panel/login', passport.authenticate('local', {
		failureFlash: true
	}), function(req, res) {
		res.send(req.user.name);
	});
};
