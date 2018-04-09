const saveToDB = require("../model/cloudant.js").saveToDB,
    classificationController = require("../controllers/classificationController");

let io;

module.exports = function (app) {

    io = require('socket.io')(app);

    var TwitterStream = require('twitter-stream-api'),
        fs = require('fs');

    io.on("connection", socket => {
        console.log("User connected");
    });

    var keys = {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token: process.env.API_TOKEN,
        token_secret: process.env.TOKEN_SECRET
    };

    var Twitter = new TwitterStream(keys, false);

    Twitter.on('connection success', function (uri) {
        console.log('connection success', uri);
    });

    Twitter.on('connection aborted', function () {
        console.log('connection aborted');
    });

    Twitter.on('connection error network', function (error) {
        console.log('connection error network', error);
    });

    Twitter.on('connection error stall', function () {
        console.log('connection error stall');
    });

    Twitter.on('connection error http', function (httpStatusCode) {
        console.log('connection error http', httpStatusCode);
    });

    Twitter.on('connection rate limit', function (httpStatusCode) {
        console.log('connection rate limit', httpStatusCode);
    });

    Twitter.on('data error', function (error) {
        console.log('data error', error);
    });

    Twitter.on('data keep-alive', function () {
        console.log('data keep-alive');
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

                        return saveToDB(tweet);
                    })
                    .catch(console.error);
            }
        }
    })
};