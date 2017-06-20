<template>
    <div>
        <main-nav/>
        <div class="container" id="main">
            <nuxt/>
        </div>
        <hc-footer/>
    </div>
</template>

<script>
  import HcFooter from '~components/layout/Footer.vue'
  import MainNav from '~components/layout/MainNav.vue'

  export default {
    beforeMount () {
      // Reauthenticate after page reload
      // Only executes on client
      const accessToken = window.localStorage.getItem('feathers-jwt')
      console.log(accessToken)
      if (accessToken) {
        this.$store.dispatch('auth/jwt', {accessToken})
      }
    },
    components: {
      HcFooter,
      MainNav
    }
  }
</script>

<style>

</style>
