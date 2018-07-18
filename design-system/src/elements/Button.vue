<template>
  <component :is="type" :class="['button', variation, color]">
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
     * Background color to give additional meaning.
     * `green, blue, white, transparent`
     */
    color: {
      type: String,
      default: "green",
      validator: value => {
        return value.match(/(green|blue|white|transparent)/)
      },
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
  @media #{$media-query-medium} {
    @include stack-space($space-base);
  }
}

.green {
  background-color: $color-green;
}
.blue {
  background-color: $color-blue;
}
.white {
  color: set-text-color($color-green, $color-white);
  background-color: $color-white;
}
.transparent {
  color: $color-green;
  background-color: transparent;
}
</style>

<docs>
  ```jsx
  <div>
    <hc-button>
      Click me please
    </hc-button>
    <hc-button color="blue">
      Click me please
    </hc-button>
    <hc-button color="white">
      Click me please
    </hc-button>
    <hc-button color="transparent">
      Click me please
    </hc-button>
  </div>
  ```
</docs>
