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
	}
}, {
	collection: 'page'
});

/**
 * Virtuals
 */

// var User = mongoose.model('User', UserSchema);

/**
 * Validation
 */


/**
 * Pre-save hook
 */
PageSchema.pre('save', function(next) {

});

/**
 * Methods
 */
PageSchema.methods = {

};

mongoose.model('Page', PageSchema);
