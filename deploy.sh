#!/bin/bash
cf login -a https://api.ng.bluemix.net -u paulostation0@gmail.com -p $BLUEMIX_PASSWORD -o paulostation0@gmail.com -s dev

if [ "$TRAVIS_BRANCH" == "test" ]
    then

        cf push tweet-dashboard-test

elif [ "$TRAVIS_BRANCH" == "prod" ] 
    then

        cf push tweet-dashboard
fi