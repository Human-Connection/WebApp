<template>
    <div>
        <main-nav/>
        <div class="container" id="main">
            <global-messages/>
            <nuxt/>
        </div>
        <hc-footer/>
    </div>
</template>

<script>
  import HcFooter from '~components/layout/Footer.vue'
  import MainNav from '~components/layout/MainNav.vue'
  import GlobalMessages from '~components/layout/GlobalMessages.vue'

  export default {
    components: {
      HcFooter,
      MainNav,
      GlobalMessages
    }
  }
</script>

<style>

</style>
