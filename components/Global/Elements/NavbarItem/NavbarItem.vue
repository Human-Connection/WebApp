<template>
  <component class="hc-navbar-item"
    @click="$emit('click')"
    :class="{ 'active' : active, 'static' : static }"
    :to="to"
    :is="component">
    <slot></slot>
    <div class="navbar-item-mobile-icon">
      <hc-icon icon="angle-right"></hc-icon>
    </div>
  </component>
</template>

<script>
  export default {
    name: 'hc-navbar-item',
    props: {
      active: {
        type: Boolean,
        default: false
      },
      to: {
        type: String,
        default: ''
      },
      static: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      component () {
        if (this.to) {
          return 'nuxt-link'
        }
        if (this.static) {
          return 'span'
        }
        return 'a'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-navbar-item {
    display: flex;
    position: relative;
    align-items: center;
    padding: 0.4rem 1rem;
    color: $grey;

    &:hover, &.uk-open, &.active {
      &:not(.static) {
        color: $grey-darker;
      }
    }

    @include until($tablet) {
      padding: 1rem 1.5rem 1rem 1rem;
      border-bottom: 1px solid $grey-lighter;
    }
  }

  .navbar-item-mobile-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    margin-top: -0.5em;
    display: flex;
    align-items: center;
    line-height: 1;

    @include from($tablet) {
      display: none;
    }
  }
</style>
