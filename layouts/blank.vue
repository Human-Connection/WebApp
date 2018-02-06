<template>
  <div class="hc__blank" :class="{ hidden: hidden }">
    <nuxt/>
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
  .hc__blank {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 150ms;
    opacity: 1;
    padding: 1.2rem;
    padding-bottom: 5rem;
  }

  .hidden {
    opacity: 0;
  }
</style>
