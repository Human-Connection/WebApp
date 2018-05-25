<template>
  <hc-emoji class="emoji" v-if="set === 'hc-emoji'" :type="icon" />
  <i v-else aria-hidden="true" :class="classes"></i>
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
       * Choose the icon set: 'fa', 'hc', 'hc-emoji'
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
  // @import "font-awesome/css/font-awesome.min.css";
  @import "~assets/styles/fonts/hc-icons.scss";

  i, emoji {
    font-size: inherit;
    vertical-align: middle;
  }

  emoji {
    width: 1.2em;
    display: inline-block;
    margin-bottom: -0.2em;
  }
</style>
