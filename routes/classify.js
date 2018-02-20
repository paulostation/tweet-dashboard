var express = require('express');
var router = express.Router();
const request = require("request");

/* GET home page. */
router.get('/', function (req, res, next) {


    console.log(req.query.text);
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
                console.log(data);
                res.send(data);
            }
        })

});

module.exports = router;