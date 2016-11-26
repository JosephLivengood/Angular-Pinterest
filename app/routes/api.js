var path = process.cwd();

module.exports = function (app) {
    
    app.route('/api')
        .get(function(req, res) { res.send('api route success') });
    
};