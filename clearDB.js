const cloudant = require("./model/cloudant");



cloudant.get1DayOldTweets()
    .then(data => {

        console.log("Number of tweets to delete: " + data.docs.length);

        tweetsToDelete = data.docs.map(tweet => {
            tweet._deleted = true;

            return tweet;
        });

        cloudant.bulk(tweetsToDelete)
            .then(console.log);

    }).catch(error => {
        console.error(error);
    })