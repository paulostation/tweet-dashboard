const Cloudant = require("cloudant");


var me = process.env.DATABASE_HOST;
var key = process.env.DATABASE_USER;
var password = process.env.DATABASE_PASSWORD;

var cloudant = Cloudant({ account: me, key: key, password: password });

let analyzed_tweets = cloudant.use("analyzed_tweet");



function getAllDocs() {
    return new Promise((resolve, reject) => {
        analyzed_tweets.find({
            "selector": {
                "timestamp_ms": {
                    "$gt": 0
                }
            }
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {

                resolve(data);
            }
        })
    })
}

function get1DayOldTweets(db) {

    return new Promise((resolve, reject) => {
        // minus 1 day in millisecondes
        let coefficient = 1000 * 60 * 60 * 24

        analyzed_tweets.find({
            "selector": {
                "timestamp": {
                    "$gt": new Date().getTime() - coefficient
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

function bulk(tweetsToDelete) {

    return new Promise((resolve, reject) => {

        analyzed_tweets.bulk({ docs: tweetsToDelete }, function (er) {
            if (er) {
                reject(er.message);
            } else {
                resolve("Finished operation");
            }
        })
    });
}

function view(viewName, param, options) {
    return new Promise((resolve, reject) => {

        analyzed_tweets.view(viewName, param,
            options, (err, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(body.rows);
                }
            });

    });
}

module.exports = {
    saveToDB: saveToDB,
    getAllDocs: getAllDocs,
    get1DayOldTweets: get1DayOldTweets,
    bulk: bulk,
    view: view
}