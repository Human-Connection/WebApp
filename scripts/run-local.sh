#!/usr/bin/env bash

# start app on the local network
LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1');
env WEBAPP_HOST=$LOCAL_IP env WEBAPP_BASE_URL=http://$LOCAL_IP:3000 env API_HOST=$LOCAL_IP yarn dev
