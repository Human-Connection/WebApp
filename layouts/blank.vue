<template>
  <div class="layout_blank" :class="{ hidden: hidden }">
    <div class="container">
      <nuxt/>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        hidden: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.hidden = false
      })
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

<style lang="scss">
  @import 'assets/styles/utilities';
  .layout_blank {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    overflow: scroll;
    // background-color: $backdrop-color;

    transition: opacity 150ms ease-in-out;

    & > .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 150ms;
      opacity: 1;
    }
  }

  .hidden {
    opacity: 0;
  }
</style>
