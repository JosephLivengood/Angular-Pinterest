var path = process.cwd();
var MostRecentHandler = require(path + '/app/controllers/mostRecent.api.js');
var PinHandler = require(path + '/app/controllers/pinHandler.api.js')

module.exports = function (app) {
    
    var mostRecentHandler = new MostRecentHandler();
    var pinHandler = new PinHandler();
    
    app.route('/api/mostRecent/:page')
        .get(mostRecentHandler.getMostRecent());
    
    app.route('/api/pins')
        .post(pinHandler.addPin());
    
};