/* jshint esversion:6 */
const request = require("request"),
    saveResultToCloudant = require("../model/cloudant").saveToDB,
    winston = require('../util/logger.js');

function classifyTweet(tweet) {

    return new Promise((resolve, reject) => {

        let options = {
            url: process.env.CLASSIFIER_URL,
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
                    winston.debug(`Classified tweet: ${tweet}, class: ${data}`);
                    resolve(data);
                }
            });
    });
}

module.exports = {
    classifyTweet: classifyTweet
};