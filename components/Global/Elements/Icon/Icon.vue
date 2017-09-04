<template>
  <i aria-hidden="true" :class="classes"></i>
</template>

<script>
  export default {
    name: 'hc-icon',
    props: {
      /**
       * Choose your icon
       */
      icon: {
        type: [String]
      },
      /**
       * Choose the icon set: 'fa', 'hc'
       */
      set: {
        type: [String],
        default: 'fa'
      }
    },
    computed: {
      classes () {
        return `${this.set} ${this.set}-${this.icon}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/hc-icons.scss";

  i {
    font-size: inherit;
    vertical-align: middle;
  }
</style>
