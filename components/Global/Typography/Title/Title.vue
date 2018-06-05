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
  @import "assets/styles/variables";

  .hc-title {
    color: $primary;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: $size-5;
    text-align: center;
    padding-top: 2em;
    padding-bottom: 1rem;
    font-weight: bold;

    /*&:after {
      content: '';
      position: relative;
      width: 40px;
      border-bottom: 1px solid $primary;
      display: block;
      margin: 7px auto 0;
    }*/
  }
</style>
