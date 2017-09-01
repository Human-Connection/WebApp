<template>
  <section class="container is-vcentered content">
    <div class="columns is-vcentered">
      <div class="column is-6 is-offset-3 has-text-centered">
        <div class="card">
          <div class="card-content">
            <p v-if="loading && !user.isVerified">Verfifying your email address ...</p>
            <template v-else-if="user.isVerified">
              <hc-emoji type="happy" width="150px"></hc-emoji>
              <h1 class="title is-2">Email verification</h1>
              <p>Your email address has been verified successfully.</p>
              <nuxt-link :to="{ name: 'auth-login' }" class="button is-primary is-medium">
                Login to your account
              </nuxt-link>
            </template>
            <template v-else>
              <hc-emoji type="surprised" width="150px"></hc-emoji>
              <h1 class="title is-2">Ooooops ...</h1>
              <p>
                We were not able to verify your email address. Maybe you the link you clicked is outdated. Please request a new verification mail.</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'

  export default {
    methods: {
      ...mapActions({
        verify: 'auth/verify'
      })
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data () {
      return {
        loading: true
      }
    },
    mounted () {
      const app = this
      const verfifyToken = app.$route.params.slug
      this.verify(verfifyToken)
        .then(() => {
          app.loading = false
        })
        .catch((error) => {
          app.loading = false
          this.$toast.open({
            message: error.message,
            duration: 3000,
            type: 'is-danger'
          })
        })
    },
    head () {
      return {
        title: 'Verification'
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
