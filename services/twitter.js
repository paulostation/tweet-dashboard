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

    Twitter.stream('statuses/filter', {
        track: 'lula,bolsonaro,ciro,gomes,alckmin,eleições'
        
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