const socket = io();

var pause = false;

$(document).ready(() => {
    $("#pause").click(() => {
        pause = !pause;    
    })
    
    $("#clear").click(() => {
        $("#tweets").html("");
    })

})

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