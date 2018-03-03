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
ENV WEBAPP_HOST=0.0.0.0

# buld application
# ENV NODE_ENV=production #we seam to have issues with the production flag on install && build
RUN yarn install --frozen-lockfile --non-interactive
RUN yarn build

# set execution rights on scripts and run the build script
RUN chmod +x ./entrypoint.sh
RUN chmod +x ./on-build.sh
RUN chmod +x ./on-start.sh
RUN ./on-build.sh

ENV NODE_ENV=production
ENTRYPOINT ["./entrypoint.sh"]

# start the application in a autohealing cluster
#CMD NODE_ENV=production ./node_modules/.bin/nuxt build && ./node_modules/.bin/backpack build && pm2 start build/main.js -n frontend -i 2 --attach
#CMD NODE_ENV=production ./node_modules/.bin/nuxt build && ./node_modules/.bin/backpack build && node build/main.js
