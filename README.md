# Real time tweet analysis !

This application is available on [https://tweet-dashboard.mybluemix.net](https://tweet-dashboard.mybluemix.net/)

The purpose is to analyze tweets doing sentiment analysis in real time.

ToDo:

 - [X] Create a view to retrieve number of tweets by hour.
 - [ ] Make chart update automatically.
 - [ ] Create a model for tweets.
 - [ ] Create tabs on website by candidate.
 - [ ] Create some way of classifying tweets by candidate.
 - [ ] Clean old tweets from front-end in order to prevent memory leak.
 - [ ] Put the view code on github
 - [ ] Create CSV script to run as child_process
 - [ ] Filter URLs and twitter usernames, as they tend to impair duplicate filter

Usage
---

1. `npm install`
2. `DEBUG=app:* npm start`