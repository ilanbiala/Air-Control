var express = require('express'),
	app = module.exports = express(),
	morgan = require('morgan'), // logger
	bodyParser = require('body-parser'), // access form data
	favicon = require('static-favicon'), // favicon handler
	passport = require('passport'), // passport authentication
	sass = require('node-sass'); // sass middleware

var config = require('./config.js')();

// lr = require('tiny-lr')();
// lr.listen(35729, function(err) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log('Livereload server starting up on port 35729.');
// 	}
// });

// app.use(require('connect-livereload')({
// 	ignore: []
// }));

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

app.get(config.routes.admin.panel.url, function(req, res) {
	res.render(config.routes.admin.panel.page, {
		locals: config.routes.admin.panel.locals
	});
});

app.listen(config.app.port);
console.log('Express server listening on port ' + config.app.port + ' in ' + config.app.environment + ' mode.');
