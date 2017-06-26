<template>
  <section class="container is-vcentered content">
    <div class="columns is-vcentered">
      <div class="column is-6 is-offset-3 has-text-centered">
        <div class="card">
          <div class="card-content">
            <p v-if="loading && !verified">Verfifying your email address ...</p>
            <template v-else-if="verified">
              <img src="/assets/svg/hc-smilies-02.svg" width="150px">
              <h1 class="title is-2">Email verification</h1>
              <p>Your email address has been verified successfully.</p>
              <nuxt-link :to="{ name: 'login' }" class="button is-primary is-medium">
                Login to your account
              </nuxt-link>
            </template>
            <p v-else>We couldn't verify your email address.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
  import {mapActions} from 'vuex'

  export default {
    methods: {
      ...mapActions({
        verify: 'auth/verify'
      })
    },
    mounted () {
      const app = this
      const verfifyToken = app.$route.params.slug
      this.verify(verfifyToken)
        .then(() => {
          app.verified = true
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
    data () {
      return {
        verified: false,
        loading: true
      }
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
