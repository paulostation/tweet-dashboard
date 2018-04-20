/* jshint esversion:6 */
const express = require('express'),
    fs = require("fs"),
    winston = require("../util/logger.js"),
    cloudantAPI = require("../model/cloudant.js");

let router = express.Router();

function getTweets(type) {

    return new Promise((resolve, reject) => {

        cloudantAPI.view("tweets-by-timestamp", type, { group: true })
            .then(resolve)
            .catch(reject);
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
                };
            });
        })
        .catch(next);

    getTweets("negative")
        .then(result => {

            negativeTweets = result.map(element => {

                return {
                    t: element.key,
                    y: element.value,
                    sentiment: "negative"
                };
            });

            res.send(positiveTweets.concat(negativeTweets));
        })
        .catch(next);
});

router.put('/feedback', (req, res, next) => {

    cloudantAPI.saveToFeedbackDB(req.body)
        .then(result => {
            res.send("OK");
        })
        .catch(next);
});

router.get('/feedback/getCSV', (req, res, next) => {

    cloudantAPI.getAllFeedbacks()
        .then(result => {

            // delete temporary file
            fs.unlink('/tmp/feedback.csv', err => {

                result.docs.forEach((tweet, index, array) => {
                    if (!tweet.text)
                        return;
                    //Remove quotes and line breaks
                    tweet.text = tweet.text.replace(/\"|\'|\n/g, " ");
                    //Remove retweet string
                    tweet.text = tweet.text.replace(/RT\ @[^:]+:/g, "");
                    //Remove tweet handles
                    tweet.text = tweet.text.replace(/@[^\s]+/g, "");
                    
                    let string = `\"${tweet.text}\",\"${tweet.sentiment}\"\n`;
                    // add a line to a lyric file, using appendFile
                    fs.appendFile('/tmp/feedback.csv', string, (err) => {
                        if (err) throw err;
                    });

                    if (index === array.length - 1) {
                        //wait 1 sec before sending csv file
                        setTimeout(() => {
                            //send CSV to user
                            res.download('/tmp/feedback.csv', 'feedback.csv', function (err) {
                                if (err) {
                                    winston.error(err);
                                } else {
                                    winston.debug("finished downloading file");
                                }
                            });
                        }, 1000);
                    }
                });
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
                    };
                })
            );
        })
        .catch(next);
});

module.exports = router;