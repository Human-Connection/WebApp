<template>
  <div class="hc-title">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'hc-title'
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-title {
    color: $primary;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
    text-align: center;

    &:after {
      content: '';
      position: relative;
      width: 40px;
      border-bottom: 1px solid $primary;
      display: block;
      margin: 7px auto 0;
    }
  }
</style>
