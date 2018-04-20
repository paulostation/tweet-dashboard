/* jshint esversion:6 */
const Cloudant = require("cloudant"),
    winston = require("../util/logger.js");

var me = process.env.DATABASE_HOST;
var key = process.env.DATABASE_USER;
var password = process.env.DATABASE_PASSWORD;

var cloudant = Cloudant({ account: me, key: key, password: password });

const databaseNames = {
    tweetDB: "analyzed_tweet",
    feedbackDB: "tweet_feedback"
}

let databases = {};

databases[databaseNames.tweetDB] = cloudant.use(databaseNames.tweetDB);
databases[databaseNames.feedbackDB] = cloudant.use(databaseNames.feedbackDB);

function getAllDocs(dbName, limit) {

    return new Promise((resolve, reject) => {


        databases[dbName].find({
            selector: {
                _id: {
                    "$gt": 0
                }
            }, limit: limit
        }, (err, data) => {
            if (err) {
                winston.error(`Cloudant API ${err}`)
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

function getAllTweets(limit) {
    return getAllDocs(databaseNames.tweetDB, limit);
}

function getAllFeedbacks(limit) {
    return getAllDocs(databaseNames.feedbackDB, limit);
}

function get1DayOldTweets(limit) {

    return new Promise((resolve, reject) => {
        // minus 1 day in milliseconds
        let coefficient = 1000 * 60 * 60 * 24;

        databases[databaseNames.tweetDB].find({
            selector: {
                "$or": [
                    {
                        timestamp_ms: {
                            //compare with string
                            "$lt": (new Date().getTime() - coefficient) + ""
                        }
                    },
                    {
                        timestamp_ms: {
                            //compare with long
                            "$lt": new Date().getTime() - coefficient
                        }
                    }
                ]
            },
            fields: [
                "_id",
                "_rev"
            ],
            limit: limit || 50000
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

function saveToDB(data) {
    return new Promise((resolve, reject) => {

        databases[databaseNames.tweetDB].insert(data, function (err, body, header) {
            if (err) {
                winston.error(`Cloudant API ${err}`)
                reject(err.message);
            } else {
                winston.silly(data);
                winston.debug(`Cloudant API Saved data ${data}`);
                resolve(true);
            }
        });
    })
}

function saveToFeedbackDB(data) {
    return new Promise((resolve, reject) => {

        databases[databaseNames.feedbackDB].insert(data, function (err, body, header) {
            if (err) {
                reject(err.message);
            } else {
                resolve(body);
            }
        });
    })
}

function bulk(tweetsToDelete) {

    return new Promise((resolve, reject) => {

        databases[databaseNames.tweetDB].bulk({ docs: tweetsToDelete }, function (er) {
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

        databases[databaseNames.tweetDB].view(viewName, param,
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
    saveToFeedbackDB: saveToFeedbackDB,
    getAllFeedbacks: getAllFeedbacks,
    getAllTweets: getAllTweets,
    get1DayOldTweets: get1DayOldTweets,
    bulk: bulk,
    view: view
}