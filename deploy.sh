#!/bin/bash
 cf login -a https://api.ng.bluemix.net -u apikey -p $BLUEMIX_API_KEY -o paulostation0@gmail.com -s dev

if [ "$TRAVIS_BRANCH" == "test" ]
    then

        cf push tweet-dashboard-test

elif [ "$TRAVIS_BRANCH" == "master" ] 
    then

        cf push tweet-dashboard
else 
    echo "Invalid branch"
    exit 1
fi