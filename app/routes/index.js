var passport = require('passport');
var path = process.cwd();

module.exports = function (app) {
    
    app.route('/login')
        .get(function(req, res) { res.render(path + '/public/pug/login') });
    
    app.route('/logout')
        .get(function(req, res) { req.logout(); res.redirect('/login') });
        
    app.route('/auth/github')
        .get(passport.authenticate('github'));
        
    app.route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }),
            function(req, res) { res.redirect('/') });
    
    app.route('/newpin')
        .get(function(req, res) { res.render(path + '/public/pug/newpin') });
    
    app.route('*')
        .get(ensureAuthenticated, function(req, res) { res.render(path + '/public/pug/index', {userinfo: req.user}) }); //JSON.stringify(req.user, null, 4)
    
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}