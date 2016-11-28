var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;
var path = process.cwd();

function mostRecent() {
    
    this.getMostRecent = function(req, res) {
        var page = req.params.page;
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('pins');
            collection.find(
                {},
                {},
                {sort: {date: -1}}
            ).skip(40*(page-1)).limit(40).toArray(function(err, doc) {
                if (err) console.log(err);
                res.send(doc);
                db.close();
            });
        });
        
    };
    
}

module.exports = mostRecent;