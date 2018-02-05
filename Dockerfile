FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# update unix packages
RUN apk update && apk upgrade
RUN apk add git
RUN rm -rf /var/cache/apk/*

# copy the project
RUN mkdir -p /var/www/
COPY . /var/www/
WORKDIR /var/www/

# expose the app port
EXPOSE 3000

# set environment variables
ENV HOST=0.0.0.0

# buld application
RUN yarn install --frozen-lockfile
# use yarn & npm caching
RUN ln -s /tmp/node_modules

# run tests
RUN yarn test

# test if the build is running
ENV NODE_ENV=production
# RUN yarn install --no-cache --production
RUN ./node_modules/.bin/nuxt build
RUN ./node_modules/.bin/backpack build

# start the application in a autohealing cluster
#CMD NODE_ENV=production ./node_modules/.bin/nuxt build && ./node_modules/.bin/backpack build && pm2 start build/main.js -n frontend -i 2 --attach
CMD NODE_ENV=production ./node_modules/.bin/nuxt build && ./node_modules/.bin/backpack build && node build/main.js