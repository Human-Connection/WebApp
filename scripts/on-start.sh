#!/usr/bin/env ash

# this script is triggered always when the image is started
# it writes the environment variables to the config files
# this is needed as nuxtjs replaces all mentions of process.env
# with static vars at build time but we need them fresh at deploy time

# set the deploy datetime
export DEPLOY_DATE="$(date +'%Y-%m-%d %T')"

# replace the remaining deploy time variables inside .env
# while also setting all non existing vars to empty values
envsub .env .env \
       --system \
       -e WEBAPP_BASE_URL=http://localhost:3000 \
       -e WEBAPP_HOST=localhost \
       -e WEBAPP_PORT=3000 \
       -e API_HOST=localhost \
       -e API_PORT=3030 \
       -e EMBED_API_URL=http://localhost:3050 \
       -e MAPBOX_TOKEN=pk.eyJ1IjoiaHVtYW4tY29ubmVjdGlvbiIsImEiOiJjajl0cnBubGoweTVlM3VwZ2lzNTNud3ZtIn0.KZ8KK9l70omjXbEkkbHGsQ
# empty remaining
envsub .env .env
envsub server/.env-secrets.tmp server/.env-secrets
