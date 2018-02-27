#!/bin/bash
cf login -a https://api.ng.bluemix.net -u paulostation0@gmail.com -p $BLUEMIX_PASSWORD -o paulostation0@gmail.com -s dev
cf push
