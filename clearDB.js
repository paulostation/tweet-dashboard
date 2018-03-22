const Cloudant = require("cloudant");


var me = 'c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com'; // Set this to your own account
var key = "addeptedurnestryingulded"
var password = "cbf03fc257940162b5391494817d6033c042773e";

var cloudant = Cloudant({ account: me, key: key, password: password });

let db = cloudant.use("analyzed_tweet");

function getOldTweets(db) {

    return new Promise((resolve, reject) => {
        // minus 1 day in millisecondes
        let coefficient = 1000 * 60 * 60 * 24

        db.find({
            "selector": {
                "timestamp": {
                    "$lt": new Date().getTime() - coefficient
                }
            },
            "fields": [
                "_id",
                "_rev"
            ]
        }, (err, data) => {
            if (err) {
                reject(error)
            } else {
                resolve(data);
            }
        })
    });
}

getOldTweets(db)
    .then(data => {
        tweetsToDelete = data.docs.map(tweet => {
            tweet._deleted = true;

            return tweet;
        });

        console.log(tweetsToDelete[0])

        db.bulk({ docs: tweetsToDelete }, function (er) {
            if (er) {
                throw er;
            } else {
                console.log("Deleted tweets");
            }
        })
    }).catch(error => {
        console.error(error);
    })
