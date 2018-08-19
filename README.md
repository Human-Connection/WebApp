<p align="center">
  <a href="https://human-connection.org"><img align="center" src="https://human-connection.org/wp-content/uploads/2017/11/human-connection-logo.svg" alt="Human Connection" /></a>
</p>


<p align="center">
  <a href="https://travis-ci.org/Human-Connection/WebApp"><img src="https://img.shields.io/travis/Human-Connection/WebApp/master.svg" alt="Build Status" /></a>
  <a href="https://david-dm.org/human-Connection/webapp"><img src="https://img.shields.io/david/human-connection/webapp.svg" "Dependencies" /></a>
  <a href="https://github.com/Human-Connection/WebApp/blob/develop/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green.svg" "MIT" /></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FHuman-Connection%2FWebApp?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FHuman-Connection%2FWebApp.svg?type=shield"/></a>
  <a href="https://discord.gg/NgVpvx9" alt="Discord Channel">
<img src="https://img.shields.io/discord/443107904757694465.svg" alt="Discord" /></a>
</p>

# Human-Connection WebApp
> uses the Nuxt.js and Express.js projects

> **Note:** This is only the WebApp part of Human-Connection, you have to also checkout the [API](https://github.com/Human-Connection/API) which is used by this WebApp.

This is the nuxt + express version of our WebApp as nuxt.js seams to be more stable and we have better options for keeping it updated.

## Local installation

> we recommend to install the project locally for the best development ease and performance

``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn start
```

Create your individual set of environment variables:
```sh
$ cp .env.example .env
# now open .env and change it according to your setup
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Env Vars

> More information on environment variables can be found in the [documentation (WIP)](https://docs.human-connection.org/environments/docker-test-production/docker-configuration.html)

#### Maintenance

You can start the app in maintenance mode so it does not ask the api in case it is down.
```
$ env MAINTENANCE=true yarn dev 
# or start
$ env MAINTENANCE=true yarn start
```

### Test Logins

**Admin**

E-Mail: `test@test.de`  
Password: `1234`

**Moderator**

E-Mail: `test2@test2.de`  
Password: `1234`

**Normal User**

E-Mail: `test3@test3.de`  
Password: `1234`

## Styleguide

The Developer Style Guide provides important infos about components and styles. To start it simply type:

``` bash
$ npm run styleguide
```
When built you can open it at [http://localhost:6060](http://localhost:6060)

## Backpack

We use [backpack](https://github.com/palmerhq/backpack) to watch and build the application, so you can use the latest ES6 features (module syntax, async/await, etc.).

## Help

The HC platform is documented in our [gitbook](https://www.gitbook.com/book/human-connection/documentation/) (work in progress).

## License 

Copyright (c) 2018 [Human-Connection.org](https://human-connection.org)

Licensed under the [MIT](https://github.com/Human-Connection/WebApp/blob/develop/LICENSE.md) license.
