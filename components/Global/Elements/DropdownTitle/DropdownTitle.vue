<template>
  <div class="hc-scroll-title">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'hc-dropdown-title'
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-scroll-title {
    font-weight: $weight-bold;
    padding: 0.8rem 1rem 0.8rem;
    border-bottom: 1px solid $grey-lighter;
    background-color: #fff;
    position: relative;
  }
</style>
