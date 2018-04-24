#!/usr/bin/env bash

# this script is triggered on build
# it writes the environment variables to the config files
# this is needed as nuxtjs replaces all mentions of process.env
# with static vars at build time but we need them fresh at deploy time

# set the build datetime
export BUILD_DATE="$(date +'%Y-%m-%d %T')"

# create .env from .env.tmp and fill in build vars
# while swill keep deploy time variables intact
envsub --protect ../.env.tmp ../.env
envsub --protect ../server/.env-secrets.tmp ../server/.env-secrets
