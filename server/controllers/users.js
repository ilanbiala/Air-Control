'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
	res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
	res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, callback) {
	var user = new User(req.body);

	user.provider = 'local';

	// because we set our user.provider to local our models/user.js validation will always be true
	req.assert('email', 'You must enter a valid email address').isEmail();
	req.assert('password', 'Password must be at least 6 characters long').len(6);
	req.assert('username', 'Username cannot be more than 100 characters').len(1, 100);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if (errors) {
		console.log("Errors: ", errors);
		return res.status(400).send(errors);
	}

	user.save(function(err) {
		if (err) {
			console.log("Error saving user: ", err);
			switch (err.code) {
				case 11000:
				case 11001:
					res.status(400).send('Username already taken');
					break;
				default:
					console.log('Please fill all the required fields.');
			}
			return callback(err);
		}

		req.logIn(user, function(err) {
			if (err) {
				console.log("Error logging in user: ", err);
				return callback(err);
			}
			return callback(err, user);
		});
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(id, callback) {
	User.findById(id, function(err, user) {
		if (err) return callback(err);
		if (!user) return callback(new Error('Failed to load User ' + id));
		return callback(err, user);
	});
};

/**
 * Remove user by id
 */
exports.remove = function(id, callback) {
	User.findById(id, function(err, user) {
		if (err) return callback(err);
		if (!user) return callback(new Error('Failed to load User ' + id));
		user.remove(function(err) {
			return callback(err);
		});
	});
};

/**
 * Update user by id
 */
/*
exports.update = function(user, callback) {

    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        callback(err, user);
    });
};
*/

/**
 * Return all users
 *
 * @return {array} [array of all the users]
 */
exports.getAll = function(callback) {
	User.find({}, function(err, users) {
		if (err) return callback(err);
		return callback(null, users);
	});
};
