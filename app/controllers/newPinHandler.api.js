var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;
var path = process.cwd();

function newPinHandler() {
    
    this.createPin = function(req, res) {
        console.log(JSON.stringify(req.body));
        var pin = {
            "imagelink": req.body.imagelink,
            "optlink": req.body.optlink,
            "title": req.body.title,
            "tag": req.body.tag.split(' '),
            "pincount": 1,
            "date": new Date()
        };
        
        mongo.connect(CONNECTION_STRING,function(err,db) {
            if (err) console.log(err);
            var collection=db.collection('pins');
            collection.insert(pin, function(err, doc) {
                if (err) console.log(err);
                var collection=db.collection('users');
                collection.findAndModify(
                    {ghid: req.user.ghid},
                    {},
                    {$addToSet: { pins: {
                        "pinid": doc.ops[0]._id,
                        "desc": req.body.desc,
                        "likes": 1,
                        "board": "personal"
                    }}}
                );
            });
         });
        res.send('complete');
    };
    
}

module.exports = newPinHandler;