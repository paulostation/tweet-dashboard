const express = require('express'),
    fs = require("fs"),
    cloudantAPI = require("../model/cloudant.js");

let router = express.Router();

function getTweets(type) {

    return new Promise((resolve, reject) => {

        cloudantAPI.view("tweets-by-timestamp", type, { group: true })
            .then(resolve)
            .catch(reject)
    });
}

/* GET home page. */
router.get('/sentiment', function (req, res, next) {

    let positiveTweets;
    let negativeTweets;

    getTweets("positive")
        .then(result => {
            positiveTweets = result.map(element => {
                return {
                    t: element.key,
                    y: element.value,
                    sentiment: "positive"
                }
            })
        })
        .catch(next);

    getTweets("negative")
        .then(result => {
            negativeTweets = result.map(element => {
                return {
                    t: element.key,
                    y: element.value,
                    sentiment: "negative"
                }
            })

            res.send(positiveTweets.concat(negativeTweets));
        })
        .catch(next)
});

router.get('/getCSV', function (req, res, next) {

    console.log("About to call cloudant api");

    cloudantAPI.getAllDocs()
        .then(result => {

            let csv = ""

            result.docs.forEach(tweet => {
                //Remove quotes and line breaks
                tweet.text = tweet.text.replace(/\"|\'|\n/g, " ");
                //Remove retweet string
                tweet.text = tweet.text.replace(/RT\ @[^:]+:/g, "");

                csv += "\"" + tweet.text + "\"" + "\n"
            });

            console.log(csv);

            fs.writeFile('tmp.csv', csv, (err) => {
                if (err) throw err;
                else {
                    res.download("tmp.csv")
                }
            });

        })
        .catch(next);
});

/**
 * Get positive, neutral or negative tweets
 */
router.get('/:sentiment', function (req, res, next) {

    getTweets(req.params.sentiment)
        .then(result => {
            res.send(
                result.map(element => {
                    return {
                        t: element.key,
                        y: element.value
                    }
                })
            )
        })
        .catch(next);
});

module.exports = router;