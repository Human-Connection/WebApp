<template>
  <div class="ql-video-embed">
    <video v-if="!embedUrl && isNativeVideo" :src="meta.url" controls></video>
    <div class="ql-video-embed-wrapper" v-if="embedUrl && !isNativeVideo">
      <div v-if="!renderEmbed"
        class="ql-video-embed-preview"
        @click="renderEmbed = true">
        <img :src="meta.image.url" />
        <div class="player-icon">
          <img src="/assets/images/media/play-light.png"
              srcset="/assets/images/media/play-light.png 2x, /assets/images/media/play-light.png 1x" />
        </div>
      </div>
      <iframe v-else
        :src="embedUrl"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen></iframe>
    </div>
    <default-embed v-if="!embedUrl && !isNativeVideo"
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
    data () {
      return {
        renderEmbed: false
      }
    },
    computed: {
      embedUrl () {
        console.log(this.meta)
        if (this.meta.player && this.meta.player.url) {
          return this.meta.player.url
        }
        if (this.meta.site_name === 'YouTube') {
          const videoUrl = this.meta.url.split('watch?v=')[1]
          return `https://www.youtube.com/embed/${videoUrl}?feature=oembed`
        }
        return false
      },
      isNativeVideo () {
        try {
          return !this.meta.embed && ['video/mp4', 'video/ogg', 'video/webm'].includes(this.meta.contentType)
        } catch (err) {
          return false
        }
      }
    }
  }
</script>

<style lang="scss">
  .ql-video-embed-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56%;

    iframe, .ql-video-embed-preview {
      position: absolute;
      top: 0;
      left: 0;
      border: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    .ql-video-embed-preview {
      cursor: pointer;

      .player-icon {
        & > img {
          width: 80px;
          height: 80px;
        }
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }
</style>
