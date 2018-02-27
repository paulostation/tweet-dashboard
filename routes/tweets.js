var express = require('express');
var router = express.Router();

const Cloudant = require("cloudant");


var me = 'c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com'; // Set this to your own account
var key = "addeptedurnestryingulded"
var password = "cbf03fc257940162b5391494817d6033c042773e";

var cloudant = Cloudant({ account: me, key: key, password: password });


// Initialize the library with my account.
// var cloudant = Cloudant("https://"+me+":"+password+"@c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com");

var analyzed_tweets = cloudant.db.use('analyzed_tweet')

function getTweets(type) {
    return new Promise((resolve, reject) => {
        analyzed_tweets.view('tweets-by-timestamp', type,
            {
                'group': true
            }
            , function (err, body) {
                if (err) {
                    reject(err)
                } else {
                    resolve(body.rows);
                }
            });
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {

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