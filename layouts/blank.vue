<template>
  <div class="layout_blank" :class="{ hidden: hidden }" :id="id">
    <div class="container" role="main">
      <nuxt/>
    </div>
    <hc-footer class="end-footer"/>
  </div>
</template>

<script>
  import HcFooter from '~/components/layout/Footer.vue'

  export default {
    components: {
      HcFooter
    },
    data () {
      return {
        hidden: true
      }
    },
    async mounted () {
      this.$nextTick(() => {
        this.hidden = false
      })
      // refresh token to fix refresh issues
      await this.$store.dispatch('auth/refreshJWT', 'layout blank')
    },
    computed: {
      id () {
        return `page-name-${this.$route.name}`
      }
    },
    head () {
      let head = {
        htmlAttrs: {
          lang: this.$i18n.locale()
        },
        title: 'loading...'
      }
      if (this.$env.NODE_ENV === 'development') {
        head.script = [
          { src: 'https://cdn.jsdelivr.net/npm/tota11y@0.1.6/build/tota11y.min.js' }
        ]
      }
      return head
    }
  }
</script>

<style lang="scss">
  @import 'assets/styles/utilities';

  .layout_blank {
    $duration: 250ms;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    min-height: 100vh;
    z-index: 9998;
    overflow: scroll;
    // background-color: $backdrop-color;
    transform: translate3d(0, 0, 0);
    transition: transform $duration ease-out, opacity $duration ease-out;

    & > .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform $duration ease-out, opacity $duration ease-out;

      opacity: 1;
    }

    .hidden {
      opacity: 0;
      transform: translate3d(0, -10px, 0);
    }

    footer.footer.end-footer {
      position: relative;
      display: inline-block;
      margin-top: 3rem;

      // position: absolute !important;
      // bottom: 0 !important;
    }
  }

</style>
