/**
 * middleware for refreshing the jwt token
 */
export default async ({store}) => {
  if (process.client) {
    await store.dispatch('auth/refreshJWT')
  }
}
