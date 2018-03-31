const Cloudant = require("cloudant");


var me = 'c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com'; // Set this to your own account
var key = "addeptedurnestryingulded"
var password = "cbf03fc257940162b5391494817d6033c042773e";

var cloudant = Cloudant({ account: me, key: key, password: password });

let analyzed_tweets = cloudant.use("analyzed_tweet");

function saveToDB(data) {
    return new Promise((resolve, reject) => {

        analyzed_tweets.insert(data, function (err, body, header) {
            if (err) {
                reject(err.message);
            } else {
                resolve(true);
            }
        });
    })
}

function getAllDocs() {
    return new Promise((resolve, reject) => {
        analyzed_tweets.find({
            "selector": {
               "timestamp_ms": {
                  "$gt": 0
               }
            }
         }, (err, data) => {
            if(err) {
                reject(err);
            } else {
                
                resolve(data);
            }
    
        })
        
       
    })
}

module.exports = {
    saveToDB: saveToDB,
    getAllDocs: getAllDocs
}