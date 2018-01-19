<template>
  <section class="global-messages">
    <template v-if="active && isAuthenticated">
      <div class="notification is-primary" v-if="!user.isVerified">
        <button class="delete" @click="active = false"></button>
        {{ $t('auth.account.verifyingResendDescription') }}
        <a @click="resendVerification()">{{ $t('auth.account.verifyingResendAction') }}</a>
      </div>
      <div class="notification is-primary" v-else-if="!user.name">
        <button class="delete" @click="active = false"></button>
        Bitte verrate uns deinen Namen um Beiträge erstellen zu können:
        <nuxt-link :to="{ name: 'auth-name' }">Namen erstellen</nuxt-link>
      </div>
    </template>
  </section>
</template>


<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'hc-verification-banner',
    data () {
      return {
        active: true
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      })
    },
    methods: {
      ...mapActions({
        resendVerifySignup: 'auth/resendVerifySignup'
      }),
      resendVerification () {
        this.resendVerifySignup()
          .then(() => {
            this.$snackbar.open({
              message: this.$t('auth.account.verifyingResendSuccess', {'email': this.state.user.email}),
              duration: 4000,
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .notification {
    margin-bottom: 30px;
    display: block;
  }
</style>
