FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# update unix packages
RUN apk update && apk upgrade
RUN apk add git
RUN rm -rf /var/cache/apk/*

# expose the app port
EXPOSE 3000

# set environment variables
ENV HOST=0.0.0.0
ENV WEBAPP_HOST=0.0.0.0

ENTRYPOINT ["./entrypoint.sh"]

# install envsub
RUN npm install -g envsub

# create working directory
RUN mkdir -p /var/www/
WORKDIR /var/www/

# install app dependencies
COPY package.json /var/www/
COPY yarn.lock /var/www/
RUN yarn install --frozen-lockfile --non-interactive

# copy the code to the docker image
COPY . /var/www/

# set execution rights on scripts and run the build script
RUN chmod +x entrypoint.sh
RUN chmod +x on-build.sh
RUN chmod +x on-start.sh
RUN sh scripts/on-build.sh

# buld application
# ENV NODE_ENV=production #we seam to have issues with the production flag on install && build
RUN yarn build

ENV NODE_ENV=production

# only keep production dependencies
# RUN yarn install --frozen-lockfile --non-interactive
