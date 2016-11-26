var path = process.cwd();

module.exports = function (app) {
    
    app.route('/login')
        .get(function(req, res) { res.render(path + '/public/pug/login') });
    
    app.route('*')
        .get(function(req, res) { res.render(path + '/public/pug/index') });
    
};