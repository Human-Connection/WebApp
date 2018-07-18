<template>
  <component :is="type" :class="['button', variation]">
    <slot/>
  </component>
</template>

<script>
/**
 * Buttons are used to allow users to perform a click action
 */
export default {
  name: "hc-button",
  status: "prototype",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the container of this component.
     */
    type: {
      type: String,
      default: "button",
    },
    /**
     * Style variation to give additional meaning.
     * `default, strong, positive, negative`
     */
    variation: {
      type: String,
      default: "default",
      validator: value => {
        return value.match(/(default|strong|positive|negative)/)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.button {
  @include reset;
  @include stack-space($space-small);
  @include inset-space($space-small);
  color: set-text-color($color-white, $color-green);
  background-color: $color-green;
  @media #{$media-query-medium} {
    @include stack-space($space-base);
  }
}
</style>

<docs>
  ```jsx
  <hc-button>
    Docs section should have an example that is shown in the documentation.
  </hc-button>
  ```
</docs>
