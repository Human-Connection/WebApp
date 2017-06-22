FROM node:8-alpine
LABEL Description="This image is used to start the hc-frontend-nuxt" Vendor="Grzegorz Leoniec" Version="1.0" Maintainer="Grzegorz Leoniec (greg@app-interactive.de)"

# update unix packages
RUN apk update && apk upgrade
RUN rm -rf /var/cache/apk/*

# copy the project
ONBUILD RUN mkdir -p /var/www/
ONBUILD COPY . /var/www/
ONBUILD WORKDIR /var/www/

# expose the app port
EXPOSE 3000

# set environment variables
ENV NPM_CONFIG_PRODUCTION=false
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# buld application
ONBUILD RUN npm install
ONBUILD RUN ./node_modules/.bin/nuxt build

ENTRYPOINT ["node", "run", "start"]