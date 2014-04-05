var express = require('express'),
	app = module.exports = express(),
	morgan = require('morgan'), // logger
	bodyParser = require('body-parser'), // access form data
	favicon = require('static-favicon'), // favicon handler
	passport = require('passport'); // passport authentication

app.use(morgan('dev'));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// development only
if (config.enviroment == 'development') {
	app.use(express.errorHandler());
}

app.listen(config.port);
console.log('Express server listening on port ' + config.port + ' in ' + config.environment + ' mode.');
