const socket = io();

socket.on('tweet', tweet => {

    $("#tweets").prepend('<div>' + tweet.text + "</div>");

});