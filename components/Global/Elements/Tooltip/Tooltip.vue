<template>
  <div v-if="isServer || disabled">
    <slot></slot>
  </div>
  <no-ssr v-else>
    <b-tooltip :label="label"
               :position="position"
               type="is-black"
               :animated="true"
               :size="size"
               :multilined="multilined">
      <slot></slot>
    </b-tooltip>
  </no-ssr>
</template>

<script>
  export default {
    name: 'hc-tooltip',
    props: {
      label: {
        type: String,
        required: true
      },
      position: {
        type: String
      },
      size: {
        type: String
      },
      multilined: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isServer: process.server
      }
    }
  }
</script>
