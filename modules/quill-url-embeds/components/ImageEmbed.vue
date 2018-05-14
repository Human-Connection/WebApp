<template>
  <div class="ql-image-embed">
    <a :href="url" target="_blank" class="ql-image-embed-link">
      <img :src="meta.image.url" />
    </a>
  </div>
</template>

<script>
  export default {
    name: 'ql-image-embed',
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
  @import "assets/styles/utilities";

  .ql-image-embed {
    position: relative;
    text-align: center;
    background-color: $white-bis;
    border: 1px solid $white-dar;

    img {
      max-height: 800px;
      width: 100%;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
  }
</style>
