<template>
  <button v-if="hasType === 'button'"
    :class="classes" @click="click" :disabled="disabled">
    <slot></slot>
  </button>
  <nuxt-link v-else-if="hasType === 'nuxt'"
    :class="classes" :to="to" @click.native="click">
    <slot></slot>
  </nuxt-link>
  <a v-else :href="to ? this.$router.resolve(to).href : ''" :class="classes" @click="click">
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
       * Set color: primary, dark, light, success, info, danger, warning
       */
      color: {
        type: String,
        default: 'primary'
      },
      /**
       * Render as a circle: true | false
       */
      circle: {
        type: Boolean,
        default: false
      },
      /**
       * Set loading state: true | false
       */
      isLoading: {
        type: Boolean,
        default: false
      },
      /**
       * Set disabled state: true | false
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * Set fullwidth state: true | false
       */
      fullWidth: {
        type: Boolean,
        default: false
      },
      /**
       * Set size: xsmall, small, medium, large
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
        let classes = ''
        if (!this.isLink) {
          classes += 'button'
        }
        if (this.color) {
          classes += ` is-${this.color}`
        }
        if (this.circle) {
          classes += ' is-circle'
        }
        if (this.isLoading) {
          classes += ' is-loading'
        }
        if (this.disabled) {
          classes += ' is-disabled'
        }
        if (this.fullWidth) {
          classes += ' is-fullwidth'
        }
        if (this.size) {
          classes += ` is-${this.size}`
        }
        return classes
      },
      hasType () {
        return this.to ? 'nuxt' : this.type
      },
      isLink () {
        return !['button', 'nuxt'].includes(this.type)
      }
    },
    methods: {
      click (e) {
        if (!this.isLink || (!e.metaKey && !e.ctrlKey)) {
          // do open detail page without reload if no extra keys are specefied
          e.preventDefault()
          this.$emit('click', e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";
  @import "~bulma/sass/elements/button.sass";

  button {
    transition: 80ms background-color ease-in-out, 80ms color ease-in-out;
  }

  .is-xsmall {
    font-size: $size-xsmall;
  }

  .is-circle {
    border-radius: 100% !important;
    width: 2.25em;
    height: 2.25em;

    &.is-medium {
      width: 2.7em;
      height: 2.7em;
    }

    &.is-large {
      width: 3.2em;
      height: 3.2em;
    }
  }

  .button {
    & > * {
      transition: opacity 100ms;
    }
    &.is-loading {
      & > * {
        opacity: .5;
      }
    }
  }


  .is-fullwidth {
    width: 100%;
  }
</style>
