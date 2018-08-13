FROM node:8.9-alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# expose the app port
EXPOSE 3000

RUN apk update && apk upgrade && apk add git && rm -rf /var/cache/apk/*
RUN yarn global add pm2 envsub

RUN mkdir -p /WebApp/
WORKDIR /WebApp/

COPY package.json /WebApp/
COPY yarn.lock /WebApp/
RUN yarn install --frozen-lockfile --non-interactive

COPY . /WebApp/
