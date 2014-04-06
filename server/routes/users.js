'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app, passport) {

    app.get('/logout', users.signout);
    app.get('/users/me', users.me);

    // Setup up the users api
    app.post('/register', users.create);

    // Setup the userId param
    app.param('userId', users.user);

    // Route to check if user is authenticated
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user.name : '0');
    });

    // Setting the local strategy route
    app.post('/login', passport.authenticate('local', {
        failureFlash: true
    }), function(req, res) {
        res.saend(req.user.name);
    });
};