FROM node:alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Human-Connection gGmbH" Version="1.0" Maintainer="Human-Connection gGmbH (developer@human-connection.org)"

# expose the app port
EXPOSE 3000

# optional git commit hash
ARG BUILD_COMMIT
ENV BUILD_COMMIT=$BUILD_COMMIT
ENV NODE_ENV=production

RUN mkdir -p /WebApp/
WORKDIR /WebApp/
# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add git python make g++

RUN yarn global add pm2

COPY package.json /WebApp/
COPY yarn.lock /WebApp/
RUN yarn install --production=false --frozen-lockfile --non-interactive

RUN apk del build-dependencies

COPY . /WebApp/
CMD ["yarn", "run", "docker:cmd", "-i", "2", "--attach"]
