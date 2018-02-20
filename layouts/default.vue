<template>
  <div>
    <hc-frame>
      <div class="container" id="main">
        <hc-verification-banner/>
        <nuxt/>
      </div>
      <hc-footer/>
    </hc-frame>
  </div>
</template>

<script>
  import HcFooter from '~/components/layout/Footer.vue'
  import HcFrame from '~/components/layout/Frame.vue'
  import HcVerificationBanner from '~/components/layout/VerificationBanner.vue'

  export default {
    components: {
      HcFooter,
      HcFrame,
      HcVerificationBanner
    },
    head () {
      let head = {
        htmlAttrs: {
          lang: this.$i18n.locale()
        }
      }
      if (process.env.NODE_ENV === 'development') {
        head.script = [
          { src: 'https://cdn.jsdelivr.net/npm/tota11y@0.1.6/build/tota11y.min.js' }
        ]
      }
      return head
    }
  }
</script>

<style scoped lang="scss">
  #main {
    margin-bottom: 15em !important;
  }
</style>
