import Raven from 'raven'

// this file is directly imported
// app is not part of context
export default async function (app) {
  if (!process.client && process.env.SENTRY_DNS_PRIVATE) {
    // LOGGING IS ENABLED
    console.log('SENTRY LOGGING IS ENABLED')
    Raven.config(process.env.SENTRY_DNS_PRIVATE, {
      release: process.env.BUILD_COMMIT,
      environment: process.env.NODE_ENV,
      tags: {
        deployed: process.env.DEPLOY_DATE,
        client: true
      }
    }).install()

    // The request handler must be the first middleware on the app
    app.use(Raven.requestHandler())
    // The error handler must be before any other error middleware
    app.use(Raven.errorHandler())
  }
}
