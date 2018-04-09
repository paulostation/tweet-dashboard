const socket = io();

$(document).ready(() => {

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
            '<button data-tweet="' + tweet.text + '" class="positive" >positivo</button>' +
            '<button data-tweet="' + tweet.text + '" class="negative" >negativo</button>' +
            '<button data-tweet="' + tweet.text + '" class="neutral" >neutro</button>' +
            '<button data-tweet="' + tweet.text + '" class="mixed" >misto</button>' +
            "</div>");
    }
    else if (tweet.analysis === 'negative') {
        $("#tweets").prepend('<div >' + tweet.text + "<br>" +
            '<button data-tweet="' + tweet.text + '" class="positive" >positivo</button>' +
            '<button data-tweet="' + tweet.text + '" class="negative" >negativo</button>' +
            '<button data-tweet="' + tweet.text + '" class="neutral" >neutro</button>' +
            '<button data-tweet="' + tweet.text + '" class="mixed" >misto</button>' +
            "</div>");
    }
    else {
        $("#tweets").prepend('<div >' + tweet.text + "<br>" +
            '<button data-tweet="' + tweet.text + '" class="positive" >positivo</button>' +
            '<button data-tweet="' + tweet.text + '" class="negative" >negativo</button>' +
            '<button data-tweet="' + tweet.text + '" class="neutral" >neutro</button>' +
            '<button data-tweet="' + tweet.text + '" class="mixed" >misto</button>' +
            "</div>");
    }

    $("#tweets").prepend('<br>');
});