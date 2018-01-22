# FROM eggplanet/nuxt

FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# update unix packages
#RUN apk update && apk upgrade
#RUN rm -rf /var/cache/apk/*

# copy the project
RUN mkdir -p /var/www/
COPY . /var/www/
WORKDIR /var/www/

# expose the app port
EXPOSE 3000

# set environment variables
#ENV NPM_CONFIG_PRODUCTION=false
ENV HOST=0.0.0.0

# install PM2 process manager and configure it for autostart
RUN npm install pm2 -g
#RUN pm2 startup

# buld application
#RUN npm install
RUN yarn cache clean
RUN yarn

ENV NODE_ENV=production
RUN ./node_modules/.bin/nuxt build
RUN ./node_modules/.bin/backpack build

# start the application in a autohealing cluster
CMD NODE_ENV=production ./node_modules/.bin/nuxt build && ./node_modules/.bin/backpack build && pm2 start build/main.js -n frontend -i 2 --attach