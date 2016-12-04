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
            callbackURL: "http://livepinterest.herokuapp.com/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));
    
    app.use(session({secret: process.env.ss}));
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
        var email, photo, location;
        
        /*Handling missing data for some users with incomplete GitHub profiles*/
        user.emails ? email = user.emails[0].value : email = 'NONE';
        user.photos ? photo = user.photos[0].value : photo = 'http://vignette4.wikia.nocookie.net/jamesbond/images/6/61/Generic_Placeholder_-_Profile.jpg/revision/latest?cb=20121227201208'; //'/assets/placeholder.jpg';
        user._json.location ? location = user._json.location : location = 'Unknown'; 
        
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('users');
            collection.findAndModify(
                {ghid: user.id},
                [['_id','asc']],
                {$setOnInsert:{
                    ghid: user.id,
                    name: user.displayName,
                    email: email,//user.emails[0].value,
                    photo: photo,//user.photos[0].value,
                    location: location,//user._json.location,
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