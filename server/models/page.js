'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Page Schema
 */
var PageSchema = new Schema({
	title: {
		type: String
	},
	url: {
		type: String
	},
	/**
	 * Store the template
	 * document here as well as in
	 * the template collection
	 */
	template: {
		type: Schema.Types.Mixed
	},
	content: {
		type: Schema.Types.Mixed
	},
	/**
	 * 0 = Users only
	 * 1 = Unlisted, not index
	 * 2 = Unlisted and indexed
	 * 3 = Visible
	 */
	visibility: {
		type: Number,
		default: 0
	},
	/**
	 * 0 = Draft
	 * 1 = Pending review
	 * 2 = In review
	 * 3 = Rejected
	 * 4 = Published
	 */
	status: {
		type: Number,
		default: 0
	},
	related: [Schema.Types.ObjectId]
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
PageSchema.pre('save', function(next) {

});
 */

/**
 * Methods
 */
PageSchema.methods = {
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
		obj.dateCreated = this._id.getTimestamp();
		obj.id = this._id.toString();
		return obj;
	}
};

mongoose.model('Page', PageSchema);
