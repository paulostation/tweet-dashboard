var express = require('express');
var router = express.Router();
const request = require("request");
const Cloudant = require("cloudant");


var me = 'c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com'; // Set this to your own account
var key = "addeptedurnestryingulded"
var password = "cbf03fc257940162b5391494817d6033c042773e";

var cloudant = Cloudant({ account: me, key: key, password: password });


// Initialize the library with my account.
// var cloudant = Cloudant("https://"+me+":"+password+"@c82f999a-c500-4ba2-b57a-847a1988c8f6-bluemix.cloudant.com");

var analyzed_tweets = cloudant.db.use('analyzed_tweet')



/* GET home page. */
router.get('/', function (req, res, next) {



    request
        .get({
            url: "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze",
            headers: {
                Authorization: "Basic ZTk5ODZlYmQtM2Q3Yy00MDdhLWJmZDItY2I4NTk5YWY4MDMyOndNb2pwWEtldTd6Tg=="
            },
            qs: {
                version: "2017-02-27",
                text: req.query.text,
                features: "sentiment",
                language: "pt"
            }
        },
            (err, responseCode, data) => {
                if (err) {
                    console.error(err);
                }
                // else if (responseCode !== 200) {
                // console.log(data)
                // res.status(500).send(data);
                // }
                else {
                    // console.log(data);
                    res.send(data);
                    saveResultToCloudant({ text: req.query.text, analysis: JSON.parse(data), timestamp: new Date().getTime() })
                        .catch(error => {
                            console.error(error)
                        });
                }
            })

});

router.get('/positives', function (req, res, next) {

    analyzed_tweets.find({
        "selector": {
           "timestamp": {
              "$gt": 1
           },
           "analysis.sentiment.document.label": "positive"
        },
        "fields": [
           "analysis.sentiment.document.label",
           "timestamp"
        ],
        "sort": [
           {
              "timestamp": "asc"
           }
        ]
     }, function (err, body, header) {
        if (err) {
            reject(err.message);
        } else {

            console.log('You have inserted the analyzed tweet.');
            
            res.send(body);
        }
    });


});

function saveResultToCloudant(data) {
    return new Promise((resolve, reject) => {


        analyzed_tweets.insert(data, function (err, body, header) {
            if (err) {
                reject(err.message);
            } else {

                console.log('You have inserted the analyzed tweet.');
                console.log(body);
                resolve(true);
            }
        });
    });
}

module.exports = router;