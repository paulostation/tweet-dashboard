# Real time tweet analysis !

This application is available on [https://tweet-dashboard.mybluemix.net](https://tweet-dashboard.mybluemix.net/)

The purpose is to analyze tweets doing sentiment analysis in real time.

ToDo:

 - [X] Create a view to retrieve number of tweets by hour.
 - [X] Refactor cloudant.js to use more than one DB at a time.
 - [ ] Download CSV writing to disk instead of memory.
 - [ ] Change stuff from router to controller.
 - [ ] Make chart update automatically.
 - [ ] Create a model for tweets.
 - [ ] Create tabs on website by candidate.
 - [ ] Create some way of classifying tweets by candidate.
 - [ ] Clean old tweets from front-end in order to prevent memory leak.
 - [ ] Put the view code on github
 - [ ] Create CSV script to run as child_process
 - [ ] Filter URLs and twitter usernames, as they tend to impair duplicate filter
 - [ ] Find some way of making a middleware on cloudant.js that checks if the database exists before making access to cloudant object, like a middleware.
 - [ ] Use gulp.js to differentiate between dev test and prod envs
 - [ ] 

Usage
---

1. `npm install`
2. `DEBUG=app:* npm start`
