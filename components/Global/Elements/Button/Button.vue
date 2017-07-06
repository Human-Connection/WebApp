<template>
    <button v-if="type === 'button'" :class="classes" @click="click">
        <slot></slot>
    </button>
    <nuxt-link v-else-if="type === 'nuxt'" :class="classes" :to="to">
        <slot></slot>
    </nuxt-link>
    <a v-else :class="classes" @click="click">
        <slot></slot>
    </a>
</template>

<script>
  /**
   * Renders a nice and smooth button element.
   */
  export default {
    name: 'hc-button',
    props: {
      /**
       * Set color: primary, info, dark, white, danger, warning
       */
      color: {
        type: String,
        default: ''
      },
      /**
       * Set loading state: true | false
       */
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * Set size: small, medium, large
       */
      size: {
        type: String,
        default: ''
      },
      /**
       * Pass a to parameter (Only for type "nuxt")
       */
      to: {
        type: [String, Object],
        default: ''
      },
      /**
       * Set type: button, link, nuxt
       */
      type: {
        type: String,
        default: 'button'
      }
    },
    computed: {
      classes () {
        let classes = 'button'
        if (this.color) {
          classes += ` is-${this.color}`
        }
        if (this.loading) {
          classes += ' is-loading'
        }
        if (this.size) {
          classes += ` is-${this.size}`
        }
        if (this.modifier) {
          classes += ` is-${this.modifier}`
        }
        return classes
      }
    },
    methods: {
      click (event) {
        this.$emit('click', event)
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "~assets/styles/utilities";
    @import "~bulma/sass/elements/button.sass";

    .active-link {
        box-shadow: 0 2px 7px rgba(0,0,0,0.6);
    }
</style>