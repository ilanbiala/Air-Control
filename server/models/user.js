'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	username: {
		type: String,
		unique: true
	},
	roles: [{
		type: String,
		default: 'authenticated'
	}],
	// superuser, administrator, writer (cannot publish), editor (can publish)
	hashed_password: String,
	salt: String,
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

/**
 * Validation
 */
var validatePresenceOf = function(value) {
	return value && value.length;
};

UserSchema.path('name').validate(function(name) {
	return (typeof name === 'string' && name.length > 0);
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
	return (typeof email === 'string' && email.length > 0);
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
	return (typeof username === 'string' && username.length > 0);
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
	return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password) && !this.provider)
		next(new Error('Invalid password'));
	else
		next();
});

/**
 * Methods
 */
UserSchema.methods = {

	/**
	 * HasRole - check if the user has required role
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	hasRole: function(role) {
		var roles = this.roles;
		return (roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1);
	},
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */
	encryptPassword: function(password) {
		if (!password || !this.salt) return '';
		var salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	},

	/**
	 * Convert Mongoose object to JSON object
	 *
	 * @return {Object}
	 * @api private
	 */
	toJSON: function() {
		var obj = this.toObject();
		delete obj.__v;
		delete obj._acl;
		delete obj.hashed_password;
		delete obj.salt;
		obj.dateCreated = this._id.getTimestamp();
		obj._id = this._id.toString();
		return obj;
	}
};

mongoose.model('User', UserSchema);
