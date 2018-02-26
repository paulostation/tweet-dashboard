const socket = io();

var pause = true;

$(document).ready(() => {
    $("#pause").click(() => {
        pause = !pause;
    })

    $("#clear").click(() => {
        $("#tweets").html("");
    })

    var ctx = document.getElementById("myChart").getContext('2d');

    positiveTweets = [];
    negativeTweets = [];
    getTweets()
        .then(data => {

            data.forEach(tweet => {

                if (tweet.sentiment === "positive") {

                    positiveTweets.push({ t: tweet.timestamp, y: tweet.count})

                }
                 else {
                    negativeTweets.push(
                        { t: tweet.timestamp, y: tweet.count * -1}
                    )
                }
            });

                console.log(positiveTweets);


            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: 'tweets positivos',
                        data: positiveTweets,
                        backgroundColor: 'rgba(0, 255, 0, 0.2)',
                        borderWidth: 2
                    }
                    ,
                    {
                        label: 'tweets negativos',
                        data: negativeTweets,
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        borderWidth: 2
                    }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                source: "labels"
                            }
                        }],
            
                        xAxes: [{
                            type: 'time',
                            stacked: true,
                            


                            distribution: "series",
                            time: {
                                // string/callback - By default, date objects are expected. You may use a pattern string from http://momentjs.com/docs/#/parsing/string-format/ to parse a time string format, or use a callback function that is passed the label, and must return a moment() instance.
                                parser: false,
                                // string - By default, unit will automatically be detected.  Override with 'week', 'month', 'year', etc. (see supported time measurements)
                                unit: 'minute',

                                // Number - The number of steps of the above unit between ticks
                                // unitStepSize: 1,

                                // string - By default, no rounding is applied.  To round, set to a supported time unit eg. 'week', 'month', 'year', etc.
                                round: true,

                                // Moment js for each of the units. Replaces `displayFormat`
                                // To override, use a pattern string from http://momentjs.com/docs/#/displaying/format/
                                displayFormats: {
                                    // max: moment().startOf('year'),
                                    // min: moment().endOf('year'),
                                    'millisecond': 'SSS [ms]',
                                    'second': 'h:mm:ss a', // 11:20:01 AM
                                    'minute': 'h:mm:ss a', // 11:20:01 AM
                                    'hour': 'MMM D, hA', // Sept 4, 5PM
                                    'day': 'MMM Do', // Sep 4 2015
                                    'week': 'll', // Week 46, or maybe "[W]WW - YYYY" ?
                                    'month': 'MMM YYYY', // Sept 2015
                                    'quarter': '[Q]Q - YYYY', // Q3
                                    'year': 'YYYY', // 2015
                                },
                            }

                              
                        }],
                    },
        
        
                }
            });

            
        });

    


});

socket.on('tweet', tweet => {

    if (pause !== false) {
        getSentiment(tweet)
            .then(result => {

                result = JSON.parse(result);

                if (result.sentiment.document.label === 'positive') {
                    $("#tweets").prepend('<div style="background-color:lightgreen">' + tweet.text + "</div>");
                }
                else if (result.sentiment.document.label === 'negative') {
                    $("#tweets").prepend('<div style="background-color:#ff5050">' + tweet.text + "</div>");
                }
                else {
                    $("#tweets").prepend('<div style="background-color:lightgray">' + tweet.text + "</div>");
                }

                $("#tweets").prepend('<br>');
            })
            .catch(error => {
                console.error(error);
            });
    }



});

function getSentiment(tweet) {

    return new Promise((resolve, reject) => {

        $.ajax({
            url: "/classify",
            method: "GET",
            data: {
                text: tweet.text
            },
            json: true,
            error: error => {
                reject(error);
            },
            success: data => {
                resolve(data);
            }
        });

    });
}

function getTweets() {

    return new Promise((resolve, reject) => {

        $.ajax({
            url: "/tweets",
            method: "GET",
            json: true,
            error: error => {
                reject(error);
            },
            success: data => {
                resolve(data);
            }
        });

    });
}