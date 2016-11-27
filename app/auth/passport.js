var path = process.cwd();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;

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
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('users');
            collection.findAndModify(
                {ghid: user.id},
                [['_id','asc']],
                {$setOnInsert:{
                    ghid: user.id,
                    name: user.displayName,
                    email: user.emails[0].value,
                    photo: user.photos[0].value,
                    location: user._json.location,
                    role: 'user',
                    pins: [],
                    boards: []
                }},
                {upsert:true, new: true},
                function(err, doc) {
                    if (err) console.log(err);
                    done(null, doc.value.ghid);
                    db.close();
                }
            );
        });
        //done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('users');
            collection.findOne(
                {ghid: id},
                {pins:0, boards:0},
                function(err, doc) {
                    if (err) console.log(err);
                    done(null, doc);
                }
            );
        });
        //done(null, user);
    });
    
};