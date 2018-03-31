const request = require("request"),
    saveResultToCloudant = require("../model/cloudant").saveToDB;

function classifyTweet(tweet) {

    return new Promise((resolve, reject) => {

        let options = {
            url: "https://tweet-analyzer.mybluemix.net/classify",
            qs: {
                text: tweet
            }
        };

        request.get(options,
            (err, responseCode, data) => {
                if (err) {
                    reject(err);
                }
                else {

                    saveResultToCloudant({ text: tweet, analysis: data, timestamp_ms: new Date().getTime() })
                        .then(() => {
                            resolve(data);
                        })
                        .catch(error => {
                            reject(error);
                        });
                }
            })
    })
}

module.exports = {
    classifyTweet: classifyTweet
}