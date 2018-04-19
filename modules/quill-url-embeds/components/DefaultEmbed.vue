<template>
  <div class="ql-default-embed">
    <a :href="url">{{ url }}</a>
  </div>
</template>

<script>
  export default {
    name: 'ql-default-embed',
    props: {
      url: {
        type: String,
        default: ''
      },
      meta: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
