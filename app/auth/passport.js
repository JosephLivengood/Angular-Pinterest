var path = process.cwd();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var session = require('express-session');

module.exports = function (app) {

    passport.use(new GithubStrategy({
            clientID: process.env.ci,
            clientSecret: process.env.cs,
            callbackURL: "https://pinterest-livengood.c9users.io/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));
    
    app.use(session({secret: process.env.ss}));
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
      // placeholder for custom user serialization
      // null is for errors
      done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
      // placeholder for custom user deserialization.
      // null is for errors
      done(null, user);
    });
 
    
};