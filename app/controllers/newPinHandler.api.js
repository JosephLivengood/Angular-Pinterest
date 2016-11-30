var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;
var path = process.cwd();

function newPinHandler() {
    
    this.createPin = function(req, res) {
        console.log(JSON.stringify(req.body));
        res.send('complete');
    };
    
}

module.exports = newPinHandler;