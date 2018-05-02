/* jshint esversion:6 */
const express = require('express'),
    router = express.Router(),
    cloudantAPI = require("../model/cloudant.js");

/* GET home page. */
router.get('/', function (req, res, next) {

    cloudantAPI.view("tweets-by-timestamp", 'positive', { group: true })
        .then(results => {
            // if there are tweets
            if (results.length) {

                let coefficient = 1000 * 60 * 15;

                let timeDiff = new Date().getTime() - coefficient;

                let oldestCommitTimestamp = results.slice(-1)[0].key;
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
