var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;
var path = process.cwd();

function pinHandler() {
    
    this.addPin = function(req, res) {
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('pins');
            
        });
    };
    
}

module.exports = pinHandler;