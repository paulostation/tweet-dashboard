/* jshint esversion:6 */
const express = require('express'),
    router = express.Router(),
    getAllTweets = require("../model/cloudant.js").getAllTweets;

router.get('/', function (req, res, next) {

    getAllTweets(1)
        .then(results => {
            // if there are tweets
            if (results.docs.length) {

                let coefficient = 1000 * 60 * 15;

                let timeDiff = new Date().getTime() - coefficient;

                let oldestCommitTimestamp = results.docs.slice(-1)[0].key;
                // and tweets are not older than threshold
                if (oldestCommitTimestamp < timeDiff) {

                    res.status(500).send("Latest document timestamp is older than threshold");

                } else {
                    res.send("OK");
                }
            } else {
                res.status(500).send("Tweet database is empty");
            }
        })
        .catch(next);
});

module.exports = router;
