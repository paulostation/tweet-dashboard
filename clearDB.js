/* jshint esversion:6 */
const cloudant = require("./model/cloudant"),
    winston = require("./util/logger.js");

function delete1DayOldTweets(remaning) {

    winston.debug("deleting old tweets");

    cloudant.get1DayOldTweets(10000)
        .then(data => {

            remaning = data.docs.length;

            winson.debug("Number of tweets to delete: " + data.docs.length);

            tweetsToDelete = data.docs.map(tweet => {

                tweet._deleted = true;

                return tweet;
            });

            return cloudant.bulk(tweetsToDelete);

        })
        .then(bulkResult => {

            winston.debug(bulkResult);

            if (remaning > 100)
                delete1DayOldTweets(remaning);
        })
        .catch(error => {
            winston.error(error);
        })
}

delete1DayOldTweets();