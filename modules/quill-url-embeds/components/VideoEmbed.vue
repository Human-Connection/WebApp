<template>
  <div class="ql-video-embed">
    <div class="ql-video-embed-wrapper" v-if="embedUrl">
      <iframe :src="embedUrl"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen></iframe>
    </div>
    <default-embed v-else
      :meta="meta"
      :url="url" ></default-embed>
  </div>
</template>

<script>
  import DefaultEmbed from './DefaultEmbed.vue'

  export default {
    name: 'ql-video-embed',
    components: {
      DefaultEmbed
    },
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
    },
    computed: {
      embedUrl () {
        if (this.meta.player && this.meta.player.url) {
          return this.meta.player.url
        }
        if (this.meta.site_name === 'YouTube') {
          const videoUrl = this.meta.url.split('watch?v=')[1]
          return `https://www.youtube.com/embed/${videoUrl}?feature=oembed`
        }
        return false
      }
    }
  }
</script>

<style lang="scss">
  .ql-video-embed-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      border: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
