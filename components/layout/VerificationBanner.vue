<template>
    <section class="global-messages">
        <div class="notification is-primary" v-if="active && isAuthenticated && !isVerified">

          <button class="delete" @click="active = false"></button>
          Please verify your account in order to make contributions to our community: <a @click="resendVerification()">resend verification mail</a>
        </div>
    </section>
</template>


<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        active: true
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        isVerified: 'auth/isVerified'
      })
    },
    methods: {
      ...mapActions({
        resendVerifySignup: 'auth/resendVerifySignup'
      }),
      resendVerification () {
        this.resendVerifySignup()
          .then(() => {
            this.$toast.open({
              message: 'We have sent you a verification mail.',
              duration: 3000,
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
    margin-bottom:30px;
    display:block;
  }
</style>
