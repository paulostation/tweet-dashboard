var express = require('express');
var router = express.Router();

const Cloudant = require("cloudant");


var me = 'c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com'; // Set this to your own account
var key = "addeptedurnestryingulded"
var password = "cbf03fc257940162b5391494817d6033c042773e";

var cloudant = Cloudant({ account: me, key: key, password: password });


// Initialize the library with my account.
// var cloudant = Cloudant("https://"+me+":"+password+"@c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com");

var analyzed_tweets = cloudant.db.use('analyzed_tweet')

/* GET home page. */
router.get('/', function (req, res, next) {

    analyzed_tweets.find({
        "selector": {
            "timestamp": {
                "$gt": 1
            }
        },
        "fields": [
            "analysis.sentiment.document.label",
            "timestamp"
        ],
        "sort": [
            {
                "timestamp": "asc"
            }
        ]

    }, function (err, body, header) {
        if (err) {
            console.log(err);
        } else {
            let coefficient = 60 * 60 * 60;

            let test = [];
            let timestamps = [];

            positive = body.docs.filter((tweet, index, array) => {

                return tweet.analysis.sentiment.document.label === "positive"

            }).map((tweet, index, array) => {

                return {
                    sentiment: tweet.analysis.sentiment.document.label,
                    timestamp: (tweet.timestamp - (tweet.timestamp % coefficient)),
                    count: 1
                }
            })

            positive.forEach((tweet, index, array) => {


                if (!timestamps.find(function (element) {
                    return element === tweet.timestamp;

                })) {
                    timestamps.push(tweet.timestamp);
                } 
            })

            positiveFiltered = [];

            timestamps.map((timestamp, index, array) => {


                let positiveTweet = positive.filter(tweet => {

                    return tweet.timestamp === timestamp;
                })

                if (positiveTweet.length === 1) {
                    positiveFiltered.push(positiveTweet[0]);
                } else if (positiveTweet.length > 1) {
                    positiveTweet[0].count = positiveTweet.length;
                    positiveFiltered.push(positiveTweet[0]);
                }

            })

            negative = body.docs.filter((tweet, index, array) => {

                return tweet.analysis.sentiment.document.label === "negative"

            }).map((tweet, index, array) => {

                return {
                    sentiment: tweet.analysis.sentiment.document.label,
                    timestamp: (tweet.timestamp - (tweet.timestamp % coefficient)),
                    count: 1
                }
            })

            negative.forEach((tweet, index, array) => {


                if (!timestamps.find(function (element) {
                    return element === tweet.timestamp;

                })) {
                    timestamps.push(tweet.timestamp);
                } 
            })

            negativeFiltered = [];

            timestamps.map((timestamp, index, array) => {


                let negativeTweet = negative.filter(tweet => {

                    return tweet.timestamp === timestamp;
                })

                if (negativeTweet.length === 1) {
                    negativeFiltered.push(negativeTweet[0]);
                } else if (negativeTweet.length > 1) {
                    negativeTweet[0].count = negativeTweet.length;
                    negativeFiltered.push(negativeTweet[0]);
                }

            })

            allTweets = positiveFiltered.concat(negativeFiltered);
            console.log(allTweets);
            res.send(allTweets);
        }
    });

});

module.exports = router;