<template>
  <div class="progressive" v-observe-visibility="visibilityChanged">
    <template v-if="!loadingPreview && wasAtOnceVisible">
      <img class="progressive-image"
           :src="src"
           :srcset="srcset"
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

  import Vue from 'vue'
  import VueObserveVisibility from 'vue-observe-visibility'

  Vue.use(VueObserveVisibility)

  export default {
    name: 'hc-progressive-image',
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
        timestampLoadPreview: 0,
        timestampLoadImage: 0,
        wasAtOnceVisible: false
      }
    },
    methods: {
      visibilityChanged (isVisible) {
        if (isVisible && !this.loadingPreview) {
          this.wasAtOnceVisible = true
        }
      },
      /**
       * Broadcast the "onPreview" Event when the preview is loaded and set the variables
       */
      onPreview (e) {
        this.loadingPreview = false
        this.loadingImage = true
        this.$emit('onPreview')

        this.timestampLoadPreview = e.timeStamp
        // console.log('onPreview', this.timestampLoadPreview / this.timestampLoadImage)
      },
      /**
       * Broadcast the "onLoad" Event when the main image is loaded and set the variables
       */
      onImage (e) {
        this.loadingImage = false
        this.loaded = true
        this.ready = true
        this.$emit('onLoad')

        this.timestampLoadImage = e.timeStamp
        if ((this.timestampLoadPreview / this.timestampLoadImage) >= 0.9) {
          this.alreadyPreloaded = true
        }
        console.log('onImage', this.timestampLoadPreview / this.timestampLoadImage)
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
  }
  img.progressive-preview {
    opacity: 1;
    z-index: -1;
    display: inline-block;
    top: 0;

    &.hide {
      transition: opacity 250ms ease-in-out;
      opacity: 0;

      &.preloaded {
        transition-duration: 0ms !important;
      }
    }
  }

</style>