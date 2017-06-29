# FROM eggplanet/nuxt

FROM node:latest
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Grzegorz Leoniec" Version="1.0" Maintainer="Grzegorz Leoniec (greg@app-interactive.de)"

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
ENV NPM_CONFIG_PRODUCTION=false
ENV HOST=0.0.0.0

# install PM2 process manager and configure it for autostart
RUN npm install pm2 -g
#RUN pm2 startup

# buld application
RUN npm install

ENV NODE_ENV=production
RUN ./node_modules/.bin/nuxt build
RUN ./node_modules/.bin/backpack build

# start the application in a autohealing cluster
CMD NODE_ENV=production pm2 start build/main.js -n frontend -i 2 --attach