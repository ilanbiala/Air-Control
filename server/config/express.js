'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	// consolidate = require('consolidate'),
	// mongoStore = require('connect-mongo')(express),
	// helpers = require('view-helpers'),
	config = require('./config')(),
	morgan = require('morgan'), // logger
	expressValidator = require('express-validator'),
	mongooseConnection = require('mongoose').connection,
	bodyParser = require('body-parser'), // access form data
	favicon = require('static-favicon'), // favicon handler
	sass = require('node-sass'), // sass middleware
	appPath = process.cwd(),
	fs = require('fs');

module.exports = function(app, passport, db) {
	app.set('showStackError', true);

	// Prettify HTML
	app.locals.pretty = true;

	// cache=memory or swig dies in NODE_ENV=production
	app.locals.cache = 'memory';

	/*
    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));
    */

	// Only use logger for development environment
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	}

	mongooseConnection.on('error', console.error.bind(console, 'Error:'));

	// The cookieParser should be above session
	// app.use(express.cookieParser());

	// Express/Mongo session storage
	/*
    app.use(express.session({
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        })
    }));
    */

	app.use(bodyParser());

	// this line must be immediately after express.bodyParser()!
	app.use(expressValidator([]));

	// Use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	app.engine('.html', require('ejs').__express);

	// set .html as the default extension
	app.set('view engine', 'html');

	// Set views path, template engine
	app.set('views', config.root + '/server/views');

	app.use(sass.middleware({
		src: config.root + '/public/sass',
		dest: config.root + '/public',
		outputStyle: 'compressed'
	}));

	app.use(express.static(config.root + '/public'));
	app.use(favicon(config.root + '/public/images/favicon.ico'));

	app.use(function(err, req, res, next) {
		// only handle `next(err)` calls
		if (err) {
			console.log(err);
			res.redirect('error');
		}
	});

	bootstrapRoutes();

	// development only
	if (config.app.enviroment == 'development') {
		app.use(errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
	}

	// TODO - move these routes into their proper place

	app.get(config.routes.home.url, function(req, res) {
		res.render(config.routes.home.page, {
			locals: config.routes.home.locals
		});
	});

	app.get(config.routes.admin.panel.url, function(req, res) {
		res.render(config.routes.admin.panel.page, {
			locals: config.routes.admin.panel.locals
		});
	});

	app.get(config.routes.admin.users.url, function(req, res) {
		res.render(config.routes.admin.users.page, {
			locals: config.routes.admin.users.locals
		});
	});

	app.get(config.routes.admin.settings.url, function(req, res) {
		res.render(config.routes.admin.settings.page, {
			locals: config.routes.admin.settings.locals
		});
	});

	// 404 page
	app.get(config.routes.error.notFound.url, function(req, res) {
		res.status(404).render(config.routes.error.notFound.page, {
			locals: config.routes.error.notFound.locals
		});
	});

	// 500 page
	app.get(config.routes.error.server.url, function(req, res) {
		res.status(500).render(config.routes.error.server.page, {
			locals: config.routes.error.server.locals
		});
	});

	app.get('/error', function(req, res) {
		res.render('error', {
			title: 'Node CMS | Error',
			url: req.url,
			originalUrl: req.originalUrl,
			user: req.session ? req.session.user : null
		});
	});

	function bootstrapRoutes() {
		var routes_path = appPath + '/server/routes';
		var walk = function(path) {
			fs.readdirSync(path).forEach(function(file) {
				var newPath = path + '/' + file;
				var stat = fs.statSync(newPath);
				if (stat.isFile()) {
					if (/(.*)\.(js$|coffee$)/.test(file)) {
						require(newPath)(app, passport);
					}
					// We skip the app/routes/middlewares directory as it is meant to be
					// used and shared by routes as further middlewares and is not a
					// route by itself
				} else if (stat.isDirectory() && file !== 'middlewares') {
					walk(newPath);
				}
			});
		};
		walk(routes_path);
	}
};