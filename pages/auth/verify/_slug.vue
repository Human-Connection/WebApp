<template>
  <section class="container is-vcentered content">
    <div class="columns is-vcentered">
      <div class="column is-6 is-offset-3 has-text-centered">
        <div class="card">
          <div class="card-content">
            <p v-if="loading && !isVerified">{{ $t('auth.account.verifyingInfo') }}</p>
            <template v-else-if="isVerified">
              <hc-emoji type="happy" width="150px"></hc-emoji>
              <h1 class="title is-2">{{ $t('auth.account.verifyingSection') }}</h1>
              <p>{{ $t('auth.account.verifyingSuccessDescription') }}</p>
              <nuxt-link v-if="!user" :to="{ name: 'auth-login' }" class="button is-primary is-medium">
                {{ $t('auth.account.loginToAccount') }}
              </nuxt-link>
              <nuxt-link v-else to="/" class="button is-primary is-medium">
                {{ $t('button.letsGo') }}
              </nuxt-link>
            </template>
            <template v-else>
              <hc-emoji type="surprised" width="150px"></hc-emoji>
              <h1 class="title is-2">{{ $t('auth.account.verifyingErrorSection') }}</h1>
              <p>{{ $t('auth.account.verifyingErrorDescription') }}</p>
              <!-- TODO missing go to button -->
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
      }),
      isVerified () {
        return !this.user ? this.verified : this.user.isVerified
      }
    },
    data () {
      return {
        isLoading: true,
        verified: false
      }
    },
    mounted () {
      const app = this
      const verfifyToken = app.$route.params.slug
      this.verify(verfifyToken)
        .then((res) => {
          console.log('RES:', res)
          this.verified = !!res
          app.isLoading = false
        })
        .catch((error) => {
          app.isLoading = false
          this.$toast.open({
            message: error.message,
            duration: 3000,
            type: 'is-danger'
          })
        })
    },
    head () {
      return {
        title: this.$t('auth.account.verifyingTitle')
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
