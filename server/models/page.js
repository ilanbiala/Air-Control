'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var PageSchema = new Schema({
	title: {
		type: String
	},
	template: {
		type: Mixed
	},
	/**
	 * Store the template
	 * document here as well as in
	 * the template collection
	 */
	visibility: {
		type: Boolean,
		default: 0
	},
	/**
	 * 0 = Visible
	 * 1 = Unlisted
	 * 2 = Users only
	 */
	status: {
		type: Number,
		default: 0
	}
	/**
	 * 0 = Draft
	 * 1 = Pending review
	 * 2 = In review
	 * 3 = Rejected
	 * 4 = Published
	 */
}, {
	collection: 'page'
});

/**
 * Virtuals
 */

/**
 * Validation
 */
var validatePresenceOf = function(value) {
	return value && value.length;
};

PageSchema.path('title').validate(function(title) {
	return (typeof title === 'string' && title.length > 0);
}, 'Title cannot be blank');

/**
 * Pre-save hook
 */
PageSchema.pre('save', function(next) {

});

/**
 * Methods
 */
PageSchema.methods = {
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

mongoose.model('Page', PageSchema);
