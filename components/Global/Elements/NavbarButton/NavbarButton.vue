<template>
  <a class="hc-navbar-button">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'hc-navbar-button'
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-navbar-button {
    display: flex;
    position: relative;
    height: $navbar-height;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    height: 60px;
    padding-left: 1rem;
    padding-right: 2.5rem;
    color: $grey;

    :after {
      border: 1px solid $primary;
      border-right: 0;
      border-top: 0;
      content: " ";
      display: block;
      height: 0.5rem;
      pointer-events: none;
      position: absolute;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-transform-origin: center;
      transform-origin: center;
      width: 0.5rem;
      margin-top: -0.375rem;
      right: 1.125rem;
      top: 50%;
    }

    &:hover, &.uk-open {
      color: $primary;
    }
  }
</style>
