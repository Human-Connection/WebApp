<template>
    <div>
        <main-nav/>
        <div class="container" id="main">
            <verification-banner/>
            <nuxt/>
        </div>
        <hc-footer/>
    </div>
</template>

<script>
  import HcFooter from '~components/layout/Footer.vue'
  import MainNav from '~components/layout/MainNav.vue'
  import VerificationBanner from '~components/layout/VerificationBanner.vue'

  export default {
    components: {
      HcFooter,
      MainNav,
      VerificationBanner
    }
  }
</script>

<style>

</style>
