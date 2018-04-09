const socket = io();

function getSentiment(tweet) {

    return new Promise((resolve, reject) => {

        $.ajax({
            url: "/classify",
            method: "GET",
            data: {
                text: tweet.text
            },
            json: true,
            error: reject,
            success: resolve
        });

    });
}

function getTweets(sentiment) {

    return new Promise((resolve, reject) => {

        $.ajax({
            url: "/tweets/" + sentiment,
            method: "GET",
            json: true,
            error: reject,
            success: resolve
        });

    });
}

function renderChart(positiveTweets, negativeTweets) {

    var graphicContext = document.getElementById("myChart").getContext('2d');

    var myChart = new Chart(graphicContext, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'tweets positivos',
                data: positiveTweets,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderWidth: 2

            },
            {
                label: 'tweets negativos',
                data: negativeTweets,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 2
            }]
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
                    distribution: "linear",
                    time: {
                        // string/callback - By default, date objects are expected. You may use a pattern string from http://momentjs.com/docs/#/parsing/string-format/ to parse a time string format, or use a callback function that is passed the label, and must return a moment() instance.
                        parser: false,
                        // string - By default, unit will automatically be detected.  Override with 'week', 'month', 'year', etc. (see supported time measurements)
                        unit: 'hour',
                        // Moment js for each of the units. Replaces `displayFormat`
                        // To override, use a pattern string from http://momentjs.com/docs/#/displaying/format/
                        displayFormats: {
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
}

$(document).ready(() => {

    positiveTweets = [];
    negativeTweets = [];

    getTweets("positive")
        .then(positive => {
            positiveTweets = positive

            return getTweets("negative");
        })
        .then(negative => {
            negativeTweets = negative;

            renderChart(positiveTweets, negativeTweets);

        })
        .catch(console.error)

        $('#tweets').on('click', 'button', function (event) {
            
            let tweetText = $(event.target).data('tweet');
            let sentiment = $(event.target).attr("class");
            
            $.ajax({
                url: "/tweets/feedback",
                method: "PUT",
                data: {
                    text: tweetText,
                    sentiment: sentiment
                },
                json: true,
                error: console.error,
                success: () => {
                    $(event.target).parent().hide()
                }
            });
          })
});

socket.on('tweet', tweet => {

    //Remove tweet handles
    tweet.text = tweet.text.replace(/https:\/\/[^\s]+/g, "");
    
    if (tweet.analysis === 'positive') {
        $("#tweets").prepend('<div >' + tweet.text + "<br>" +
        '<button data-tweet="'+ tweet.text+'" class="positive" >positivo</button>' +
        '<button data-tweet="'+ tweet.text+'" class="negative" >negativo</button>' +
        '<button data-tweet="'+ tweet.text+'" class="neutral" >neutro</button>' +
        '<button data-tweet="'+ tweet.text+'" class="mixed" >misto</button>' +
         "</div>");
    }
    else if (tweet.analysis === 'negative') {
        $("#tweets").prepend('<div >' + tweet.text + "<br>" +
        '<button data-tweet="'+ tweet.text+'" class="positive" >positivo</button>' +
        '<button data-tweet="'+ tweet.text+'" class="negative" >negativo</button>' +
        '<button data-tweet="'+ tweet.text+'" class="neutral" >neutro</button>' +
        '<button data-tweet="'+ tweet.text+'" class="mixed" >misto</button>' +
         "</div>");
    }
    else {
        $("#tweets").prepend('<div >' + tweet.text + "<br>" +
        '<button data-tweet="'+ tweet.text+'" class="positive" >positivo</button>' +
        '<button data-tweet="'+ tweet.text+'" class="negative" >negativo</button>' +
        '<button data-tweet="'+ tweet.text+'" class="neutral" >neutro</button>' +
        '<button data-tweet="'+ tweet.text+'" class="mixed" >misto</button>' +
         "</div>") ;
    }

    $("#tweets").prepend('<br>');
});