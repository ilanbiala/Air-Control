var express = require('express'),
	app = module.exports = express(),
	morgan = require('morgan'), // logger
	domain = require('domain'),
	errorHandler = require('express-error-handler'),
	bodyParser = require('body-parser'), // access form data
	favicon = require('static-favicon'), // favicon handler
	passport = require('passport'), // passport authentication
	sass = require('node-sass'); // sass middleware


var config = require('./server/config/config.js')();

app.use(morgan('dev'));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(sass.middleware({
	src: __dirname + '/public/sass',
	dest: __dirname + '/public',
	outputStyle: 'compressed'
}));

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/images/favicon.ico'));

app.use(function(err, req, res, next) {
	// only handle `next(err)` calls
	if (err) {
		console.log('404');
		res.sendfile('404.html');
	}
});

// development only
if (config.app.enviroment == 'development') {
	app.use(errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
}

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

// 404 page
app.get(config.routes.error.notFound.url, function(req, res) {
	res.render(config.routes.error.notFound.page, {
		locals: config.routes.error.notFound.locals
	});
});

// 500 page
app.get(config.routes.error.server.url, function(req, res) {
	res.render(config.routes.error.server.page, {
		locals: config.routes.error.server.locals
	});
});

app.get('/error', function(req, res) {
	res.render('error', {
		url: req.url,
		originalUrl: req.originalUrl,
		user: req.session ? req.session.user : null
	});
});

var serverDomain = domain.create();

serverDomain.run(function() {
	app.listen(config.app.port, function() {

		console.log('Express server listening on port ' + config.app.port + ' in ' + config.app.environment + ' mode.');

		var reqd = domain.create();

		reqd.on('error', function(er) {
			console.error('Error', er, req.url);
			try {
				res.writeHead(500);
				res.end('Error occurred, sorry.');
			} catch (er) {
				console.error('Error sending 500', er, req.url);
			}
		});
	});
});