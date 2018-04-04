const cloudant = require("./model/cloudant");

function delete1DayOldTweets(remaning) {

    console.log("deleting old tweets");

    cloudant.get1DayOldTweets()
        .then(data => {

            remaning = data.docs.length;

            console.log("Number of tweets to delete: " + data.docs.length);

            tweetsToDelete = data.docs.map(tweet => {

                tweet._deleted = true;

                return tweet;
            });

            return cloudant.bulk(tweetsToDelete);

        })
        .then(bulkResult => {

            console.log(bulkResult);
            
            if (remaning < 100)
                delete1DayOldTweets(remaning);
        })
        .catch(error => {
            console.error(error);
        })
}

delete1DayOldTweets();