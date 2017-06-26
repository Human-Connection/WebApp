<template>
    <section class="global-messages">
        <div class="notification is-primary" v-if="isAuthenticated && !isVerified">
          <button class="delete"></button>
          Please verify your account in order to make contributions to our community.
        </div>
    </section>
</template>


<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        isVerified: 'auth/isVerified'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .notification {
    margin-bottom:30px;
  }
</style>
