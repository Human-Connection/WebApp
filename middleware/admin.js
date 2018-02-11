// import errors from 'feathers-errors'

export default function ({ store, redirect, error }) {
  if (!store.getters['auth/isAdmin']) {
    return error({ statusCode: 403 })
  }
}
