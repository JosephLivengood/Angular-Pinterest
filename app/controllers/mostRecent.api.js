var mongo = require('mongodb').MongoClient;
var CONNECTION_STRING = process.env.db;
var path = process.cwd();
var ObjectID = require('mongodb').ObjectID;

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
            ).skip(15*(page-1)).limit(15).toArray(function(err, doc) {
                if (err) console.log(err);
                res.json(doc);
                db.close();
            });
        });
    };
    
    this.getCateBoard = function(req, res) {
        var page = req.params.page;
        var cate = req.params.cate;
        cate = cate.toLowerCase();
        console.log(cate+page);
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('pins');
            collection.find(
                {tag: cate},
                {},
                {sort: {date: -1}}
            ).skip(15*(page-1)).limit(15).toArray(function(err, doc) {
                if (err) console.log(err);
                res.json(doc);
                db.close();
            });
        });
    };
    
    
    
    this.getUserBoard = function(req, res) {
        
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }
        
        mongo.connect(CONNECTION_STRING,function(err,db) {
		    if (err) console.log(err);
            var collection=db.collection('users');
            collection.find(
                {ghid: req.user.ghid},
                {pins: 1},
                {}
            ).toArray(function(err, doc) {
                if (err) console.log(err);
                var pinArr = [];
                for(var i = 0; i < doc[0].pins.length; i++) {
                    pinArr.push(doc[0].pins[i].pinid);
                    doc[0].pins[i].pinid = String(doc[0].pins[i].pinid);
                }
                collection=db.collection('pins');
                collection.find(
                    {_id: {$in: pinArr}},
                    {recentpinner: 0}
                ).toArray(function(err, doc2) {
                    if (err) console.log(err);
                    res.json(doc2);
                    db.close();
                });
            });
        });        
    };
    
}

module.exports = mostRecent;