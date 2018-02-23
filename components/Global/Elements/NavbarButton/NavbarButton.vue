<template>
  <a class="hc-navbar-button"
    @click="$emit('click')"
    :class="{ 'active' : active, 'static' : static }">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'hc-navbar-button',
    props: {
      active: {
        type: Boolean,
        default: false
      },
      static: {
        type: Boolean,
        default: false
      }
    }
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
    padding-left: 1rem;
    padding-right: 2.5rem;
    color: $grey;

    &:after {
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

    &:hover, &.uk-open, &.active {
      &:not(.static) {
        color: $primary;
      }
    }
  }
</style>
