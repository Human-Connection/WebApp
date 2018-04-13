<template>
  <div class="ql-embed-item">
    <component
      :url="url"
      :meta="meta"
      :is="componentType"></component>
  </div>
</template>

<script>
  import LinkEmbed from './LinkEmbed.vue'
  import VideoEmbed from './VideoEmbed.vue'
  import DefaultEmbed from './DefaultEmbed.vue'

  export default {
    name: 'ql-embed-item',
    components: {
      LinkEmbed,
      VideoEmbed,
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
      componentType () {
        if (this.meta.embed && this.meta.embed.type === 'video') {
          return 'video-embed'
        }
        if (this.meta.embed && this.meta.embed.type === 'link') {
          return 'link-embed'
        }
        if (this.meta.site_name && this.meta.url) {
          return 'link-embed'
        }
        return 'default-embed'
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
</style>
