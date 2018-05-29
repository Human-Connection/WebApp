#!/usr/bin/env ash

# this script is triggered always when the image is started
# it writes the environment variables to the config files
# this is needed as nuxtjs replaces all mentions of process.env
# with static vars at build time but we need them fresh at deploy time

# setting deploy time environment vars and writing them to .env
./on-start.sh

# starting the application with the correct settings
yarn start:pm2 -p $WEBAPP_PORT -H $WEBAPP_HOST
