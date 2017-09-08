<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'hc-box',
    props: ['top', 'bottom'],
    computed: {
      classes () {
        let classes = 'card is-box'
        if (this.top) {
          classes += ' has-margin-top'
        }
        if (this.bottom) {
          classes += ' has-margin-bottom'
        }
        return classes
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";

  .card {
    border: none;
    box-shadow: 0px 5px 13px -4px rgba(0, 0, 0, .1);
  }

  .is-box {
    background-color: $white;
    padding: 15px;
  }
</style>
