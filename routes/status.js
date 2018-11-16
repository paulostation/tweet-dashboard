/* jshint esversion:6 */
const express = require('express'),
    router = express.Router(),
    winston = require("../util/logger.js"),
    getAllTweets = require("../model/cloudant.js").getAllTweets;

router.get('/', function (req, res, next) {

    getAllTweets(1)
        .then(results => {
            // if there are tweets
            if (results.docs.length) {

                let coefficient = 1000 * 60 * 15;

                let timeDiff = new Date().getTime() - coefficient;
                
                let oldestCommitTimestamp = results.docs[0].timestamp_ms;
                winston.silly("Oldest commit date:",new Date(oldestCommitTimestamp / 1).toString())
                winston.silly("Tweet date threshold:",new Date(timeDiff).toString())
                // and tweets are not older than threshold
                if (oldestCommitTimestamp < timeDiff) {

                    res.status(500).send("Latest document timestamp is older than threshold");
                    winston.error("Latest document timestamp is older than threshold, restarting...");
                    process.exit(1);
                } else {
                    res.send("OK");
                }
            } else {
                res.status(500).send("Tweet database is empty");
                winston.error("Tweet database is empty, restarting...");
                process.exit(1);
            }
        })
        .catch(next);
});

module.exports = router;
