var io;

let saveToDB = require("./model/cloudant.js").saveToDB;

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
        track: 'lula'
    });

    Twitter.on("data", function (data) {

        let tweet = JSON.parse(data.toString('utf8'));

        if (tweet.lang === "pt") {

            io.emit('tweet', tweet);
            // saveToDB(tweet)
            // .catch(error => {
            //     console.error(error);
            // });

        }
    })
};