<template>
  <div class="progressive">
    <template v-if="!loadingPreview && wasAtLeastOnceVisible">
      <img class="progressive-image"
           :src="src"
           :alt="alt"
           :srcset="srcset"
           :class="{ ready: ready }"
           @load="onImage"
           @error="onErrorImage" />
    </template>
    <template>
      <img class="progressive-preview"
           :class="{ hide: loaded, preloaded: alreadyPreloaded }"
           :src="preview"
           :alt="alt"
           @load="onPreview"
           @error="onErrorPreview" />
    </template>
    <slot />
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
       * Preview image URL
       */
      preview: {
        type: String
      },
      /**
       * Image URL
       */
      src: {
        type: String,
        required: true
      },
      /**
       * Image alt tag
       */
      alt: {
        type: String
      },
      /**
       * Response image set
       */
      srcset: {
        type: String
      },
      inViewportOffset: {
        type: Number,
        default: -150
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
          this.removeInViewportHandlers()
        }
      },
      'inViewport.fully' (visible) {
        if (visible) {
          this.wasAtLeastOnceVisible = true
          this.removeInViewportHandlers()
        }
      }
    },
    mounted () {
      if (this.inViewport.now) {
        this.wasAtLeastOnceVisible = true
      } else {
        this.inViewport.listening = true
      }
    },
    methods: {
      /**
       * Broadcast the "onPreview" Event when the preview is loaded and set the variables
       */
      onPreview (e) {
        this.loadingPreview = false
        this.$emit('onPreview')

        if (!this.wasAtLeastOnceVisible) {
          this.inViewport.listening = true
          this.removeInViewportHandlers()
          this.inViewportInit()
        }

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

        this.inViewport.listening = false
        this.removeInViewportHandlers()
      },
      onErrorPreview (e) {
        this.loadingImage = false
        this.loaded = true
        this.ready = true
        this.$emit('error')
        this.$emit('onPreview')
        this.inViewport.listening = false
        this.removeInViewportHandlers()
      },
      onErrorImage (e) {
        this.loadingImage = false
        this.loaded = true
        this.ready = true
        this.$emit('error')
        this.$emit('onLoad')
        this.inViewport.listening = false
        this.removeInViewportHandlers()
      }
    }
  }
</script>

<style scoped lang="scss">

  .progressive {
    display: block;
    position: relative;
    overflow: hidden;
    min-width: 100%;
  }

  img.progressive-image {
    position: absolute;
    display: block;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;

    transition: opacity 250ms ease-in-out;

    &.ready {
      opacity: 1;
    }
  }
  img.progressive-preview {
    opacity: 1;
    z-index: -1;
    display: block;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;

    &.hide {
      transition: opacity 0ms ease-in-out;
      opacity: 0;

      &.preloaded {
        transition-duration: 0ms !important;
      }
    }
  }

</style>
