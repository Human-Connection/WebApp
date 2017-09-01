<template>
  <img :src="'/assets/svg/emoji/' + type + '.svg'" :width="width" :height="height" />
</template>

<script>
  export default {
    name: 'hc-emoji',
    props: {
      type: {
        type: String,
        required: true
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      }
    }
  }
</script>

<style scoped lang="scss">
  img {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
  }
</style>