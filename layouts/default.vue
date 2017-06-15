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
    components: {
      HcFooter,
      MainNav
    }
  }
</script>

<style>

</style>
