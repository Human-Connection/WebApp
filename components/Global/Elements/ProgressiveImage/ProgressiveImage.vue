<template>
  <div class="progressive">
    <template v-if="!loadingPreview && wasAtLeastOnceVisible">
      <img class="progressive-image"
           :src="src"
           :srcset="srcset"
           :class="{ ready: ready }"
           @load="onImage" />
    </template>
    <template>
      <img class="progressive-preview"
           :class="{ hide: loaded, preloaded: alreadyPreloaded }"
           :src="preview"
           @load="onPreview" />
    </template>
  </div>
</template>

<script>
  /**
   * Component for displaying an Image. The Preview is positioned above the main image and faded away
   */

  import inViewport from 'vue-in-viewport-mixin'

  export default {
    name: 'hc-progressive-image',
    mixins: [ inViewport ],
    props: {
      /**
       * Preview image url
       */
      preview: {
        type: String
      },
      /**
       * Image url
       */
      src: {
        type: String,
        required: true
      },
      /**
       * Response image set
       */
      srcset: {
        type: String
      }
    },
    data () {
      return {
        loadingPreview: true,
        loadingImage: false,
        alreadyPreloaded: false,
        loaded: false,
        ready: false,
        wasAtLeastOnceVisible: false
      }
    },
    watch: {
      'inViewport.now' (visible) {
        if (visible) {
          this.wasAtLeastOnceVisible = true
        }
      }
    },
    mounted () {
      this.wasAtLeastOnceVisible = !!this.inViewport.now
    },
    methods: {
      /**
       * Broadcast the "onPreview" Event when the preview is loaded and set the variables
       */
      onPreview (e) {
        this.loadingPreview = false
        this.$emit('onPreview')
        if (this.inViewport.now) {
          this.wasAtLeastOnceVisible = true
        }
      },
      /**
       * Broadcast the "onLoad" Event when the main image is loaded and set the variables
       */
      onImage (e) {
        this.loadingImage = false
        setTimeout(() => {
          this.loaded = true
        }, 1000)
        this.ready = true
        this.$emit('onLoad')
      }
    }
  }
</script>

<style scoped lang="scss">

  .progressive {
    display: block;
    position: relative;
  }

  img.progressive-image {
    position: absolute;
    display: block;
    top: 0;
    opacity: 0;

    transition: opacity 250ms ease-in-out;

    &.ready {
      opacity: 1;
    }
  }
  img.progressive-preview {
    opacity: 1;
    z-index: -1;
    display: inline-block;
    top: 0;

    &.hide {
      transition: opacity 0ms ease-in-out;
      opacity: 0;

      &.preloaded {
        transition-duration: 0ms !important;
      }
    }
  }

</style>