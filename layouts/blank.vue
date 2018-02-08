<template>
  <div class="layout_blank" :class="{ hidden: hidden }">
    <div class="content">
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

    & > .content {
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
