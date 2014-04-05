var express = require('express'),
	app = module.exports = express(),
	morgan = require('morgan'), // logger
	bodyParser = require('body-parser'), // access form data
	domain = require("domain"),
	expressEjsLayouts = require('express-ejs-layouts'),
	favicon = require('static-favicon'), // favicon handler
	passport = require('passport'), // passport authentication
	sass = require('node-sass'); // sass middleware


var config = require('./config.js')();

app.use(morgan('dev'));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.set('layout', 'admin/layout');
app.use(expressEjsLayouts);

app.use(sass.middleware({
	src: __dirname + '/public/sass',
	dest: __dirname + '/public',
	outputStyle: 'compressed'
}));

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/images/favicon.ico'));

// development only
if (config.app.enviroment == 'development') {
	app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.render('index', {
		locals: {
			title: 'NODE-CMS',
			page: 'home'
		}
	});
});

app.get('/test', function(req, res) {
	throw new Error('adsf');
});

app.get(config.routes.admin.panel.url, function(req, res) {
	res.render(config.routes.admin.panel.page, {
		locals: config.routes.admin.panel.locals
	});
});

var d = domain.create();

d.on('error', function(er) {
	//your handler here    
	console.log("er");
	// console.log(er);
});

d.run(function() {
	//create the server here, 
	//errors thrown will be handled by the domain handler
	app.listen(config.app.port);
	console.log('Express server listening on port ' + config.app.port + ' in ' + config.app.environment + ' mode.');
});
