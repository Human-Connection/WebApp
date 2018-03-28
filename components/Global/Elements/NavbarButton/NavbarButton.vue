<template>
  <a class="hc-navbar-button"
    @click="$emit('click')"
    :class="{ 'active' : active, 'static' : static }">
    <slot></slot>
    <div class="navbar-button-icon">
      <hc-icon icon="angle-down"></hc-icon>
    </div>
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
    padding: 0 1rem;
    color: $grey;

    &:hover, &.uk-open, &.active {
      &:not(.static) {
        color: $primary;
      }
    }
  }

  .navbar-button-icon {
    font-size: 1rem;
    line-height: 1;
    margin-left: 0.4rem;
    color: $primary;
    opacity: 0.8;
  }
</style>
