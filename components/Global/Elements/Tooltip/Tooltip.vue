<template>
  <div v-if="isServer">
    <slot></slot>
  </div>
  <no-ssr v-else>
    <b-tooltip :label="label" :position="position" type="is-black">
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
      }
    },
    data () {
      return {
        isServer: process.server
      }
    }
  }
</script>