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
  export default {
    description: 'Renders a nice and smooth button element.',
    examples: [
      {
        slot: 'Primary Button',
        props: {
          color: 'primary'
        }
      },
      {
        slot: 'Big Nuxt Button',
        props: {
          color: 'primary',
          size: 'large',
          type: 'nuxt',
          to: '/profile'
        }
      },
      {
        slot: 'Link Button',
        props: {
          color: 'info',
          type: 'link',
          href: '/profile'
        }
      }
    ],
    props: {
      color: {
        type: String,
        default () {
          return ''
        },
        description: 'A button can appear in multiple colors.',
        values: [
          'primary',
          'info',
          'success',
          'warning',
          'danger',
          'link'
        ]
      },
      loading: {
        type: Boolean,
        default () {
          return false
        },
        description: 'A button can appear in loading state',
        values: [
          true,
          false
        ]
      },
      size: {
        type: String,
        default () {
          return ''
        },
        description: 'A button can appear in different sizes.',
        values: [
          'small',
          'medium',
          'large'
        ]
      },
      to: {
        type: [String, Object],
        default () {
          return ''
        },
        description: 'Pass a to parameter (Only for type "nuxt")'
      },
      type: {
        type: String,
        default () {
          return 'button'
        },
        description: 'Specify the button type.',
        values: [
          'link',
          'button',
          'nuxt'
        ]
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