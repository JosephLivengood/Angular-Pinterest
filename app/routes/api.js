var path = process.cwd();
var MostRecentHandler = require(path + '/app/controllers/mostRecent.api.js');
var PinHandler = require(path + '/app/controllers/pinHandler.api.js');
var NewPinHandler = require(path + '/app/controllers/newPinHandler.api.js');

module.exports = function (app) {
    
    var mostRecentHandler = new MostRecentHandler();
    var pinHandler = new PinHandler();
    var newPinHandler = new NewPinHandler();
    
    app.route('/api/mostRecent/:page')
        .get(mostRecentHandler.getMostRecent);
        
    app.route('/api/userboard')
        .get(mostRecentHandler.getUserBoard);
        
    app.route('/api/pin/new')
        .post(newPinHandler.createPin);
        
    app.route('/api/pin/:id')
        .post(pinHandler.repin);
        
    app.route('/api/cate/:cate/:page')
        .get(mostRecentHandler.getCateBoard);
    
};