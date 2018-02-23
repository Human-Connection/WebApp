<template>
  <component class="hc-navbar-item"
    @click="$emit('click')"
    :class="{ 'active' : active, 'static' : static }"
    :to="to"
    :is="component">
    <slot></slot>
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
  }
</style>
