<template>
    <button v-if="type === 'button'" :class="classes" @click="click">
        <slot></slot>
    </button>
    <nuxt-link v-else-if="type === 'nuxt'" :class="classes" :to="to">
        <slot></slot>
    </nuxt-link>
    <a v-else :class="classes" :href="url" @click="click">
        <slot></slot>
    </a>
</template>

<script>
  export default {
    props: {
      color: {
        validator (value) {
          return value === '' ||
            value === 'primary' ||
            value === 'info' ||
            value === 'success' ||
            value === 'warning' ||
            value === 'danger' ||
            value === 'white' ||
            value === 'light' ||
            value === 'dark' ||
            value === 'black' ||
            value === 'link'
        },
        default () {
          return ''
        }
      },
      loading: {
        type: Boolean,
        default () {
          return false
        }
      },
      size: {
        validator (value) {
          return value === '' ||
            value === 'small' ||
            value === 'medium' ||
            value === 'large'
        },
        default () {
          return ''
        }
      },
      to: {
        type: [String, Object],
        default () {
          return ''
        }
      },
      type: {
        validator (value) {
          return value === 'link' ||
            value === 'button' ||
            value === 'nuxt'
        },
        default () {
          return 'link'
        }
      },
      url: {
        type: [String],
        default () {
          return ''
        }
      },
      modifier: {
        type: [String],
        default () {
          return ''
        }
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
</style>