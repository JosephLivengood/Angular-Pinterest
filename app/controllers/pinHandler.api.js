var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;
var path = process.cwd();
var ObjectID = require('mongodb').ObjectID;

function pinHandler() {
    
    this.repin = function(req, res) {
        console.log('repin');
        var id = req.params.id;
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('users');
            collection.findAndModify(
                {ghid: req.user.ghid},
                {},
                {$addToSet: { pins: {
                    "pinid": new ObjectID(id),
                    "board": "personal"
                }}}
            );
            db.collection('pins').findAndModify(
               {_id: new ObjectID(id)},
               {},
               {$inc: { "pincount" : 1 }}
            );
            res.send('complete');
        });
    };
    
}

module.exports = pinHandler;