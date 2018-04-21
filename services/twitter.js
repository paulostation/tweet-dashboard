/* jshint esversion:6 */
const saveToDB = require("../model/cloudant.js").saveToDB,
    winston = require("../util/logger.js"),
    classificationController = require("../controllers/classificationController");


let io;

module.exports = function (app) {

    io = require('socket.io')(app);

    var TwitterStream = require('twitter-stream-api'),
        fs = require('fs');

    io.on("connection", socket => {
        winston.debug("User connected");
    });

    var keys = {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token: process.env.API_TOKEN,
        token_secret: process.env.TOKEN_SECRET
    };

    var Twitter = new TwitterStream(keys, false);

    Twitter.on('connection success', function (uri) {
        winston.debug('Twitter API connection success', uri);
    });

    Twitter.on('connection aborted', function () {
        winston.error('Twitter API connection aborted');
    });

    Twitter.on('connection error network', function (error) {
        winston.error('Twitter API connection error network', error);
    });

    Twitter.on('connection error stall', function () {
        winston.error('Twitter API connection error stall');
    });

    Twitter.on('connection error http', function (httpStatusCode) {
        winston.error(`Twitter API connection error: ${httpStatusCode}`);
    });

    Twitter.on('connection rate limit', function (httpStatusCode) {
        winston.error(`Twitter API connection rate limit ${httpStatusCode}`);
    });

    Twitter.on('data error', function (error) {
        winston.error('Twitter API data error', error);
    });

    Twitter.on('data keep-alive', function () {
        winston.debug('Twitter API data keep-alive');
    });


    Twitter.stream('statuses/filter', {
        track: process.env.TWEET_TRACKING,
        stall_warnings: true

    });

    Twitter.on("data", function (data) {
        //data comes as buffer, parse to UTF8
        let tweet = JSON.parse(data.toString('utf8'));
        //filter only portuguese tweets
        if (tweet.lang === "pt") {

            //skip retweets
            if (tweet.text.lastIndexOf("RT @") !== 0) {

                classificationController.classifyTweet(tweet.text)
                    .then(result => {

                        io.emit('tweet', {
                            text: tweet.text,
                            analysis: result
                        });
                        tweet.analysis = result;
                        // if (process.env.ENVIRONMENT === "prod")
                            return saveToDB(tweet);
                    })
                    .catch(winston.error);
            }
        }
    })
};