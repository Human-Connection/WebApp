<template>
  <div class="map-wrapper" :style="{width: width, height: height}">
    <div v-if="isLoading" class="is-loading" :style="{height: height}">&nbsp;</div>
    <div v-if="wasAtLeastOnceVisible" id="map"></div>
  </div>
</template>

<script>
  import inViewport from 'vue-in-viewport-mixin'

  export default {
    mixins: [ inViewport ],
    props: {
      /**
       * Collection of points on the map
       */
      places: {
        type: Array,
        required: true,
        default: []
      },
      width: {
        type: [Number, String],
        default: 'auto'
      },
      height: {
        type: [Number, String],
        default: '200px'
      },
      token: {
        type: String,
        required: true
      },
      lang: {
        type: String,
        default: 'en'
      },
      /**
       * Center point of the map
       */
      center: {
        type: [Object, Array],
        default () {
          return {
            lat: 49.890860,
            lng: 10.327148
          }
        }
      },
      /**
       * Zoom parameter
       */
      zoom: {
        type: [Number, String],
        default: 16
      }
    },
    data () {
      return {
        map: null,
        isLoading: true,
        wasAtLeastOnceVisible: false
      }
    },
    name: 'hc-map',
    mounted () {
      if (this.inViewport.now) {
        this.wasAtLeastOnceVisible = true
      } else {
        this.inViewport.listening = true
      }
    },
    watch: {
      'inViewport.now' (visible) {
        if (visible) {
          this.wasAtLeastOnceVisible = true
          this.removeInViewportHandlers()
          this.$nextTick(() => {
            this.createMap()
          })
        }
      },
      'inViewport.fully' (visible) {
        if (visible) {
          this.wasAtLeastOnceVisible = true
          this.removeInViewportHandlers()
        }
      },
      lang (lang) {
        if (this.map) {
          this.applyLanguage(lang)
        }
      }
    },
    methods: {
      applyLanguage (lang) {
        if (!lang) {
          lang = this.lang
        }
        this.map.setLayoutProperty('country-label-lg', 'text-field', ['get', 'name_' + lang])
      },
      createMap () {
        try {
          const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
          mapboxgl.accessToken = this.token
          // init the map
          this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v10',
            zoom: this.zoom,
            center: this.center
          })
          this.map.on('data', (e) => {
            if (e.isSourceLoaded) {
              this.applyLanguage()
              this.isLoading = false
              this.map.off('data')
            }
          })

          this.places.forEach((marker) => {
            // create the popup
            let popup = new mapboxgl.Popup()
              .setText(marker.properties.title)

            // create a HTML element for each feature
            let el = document.createElement('div')
            el.className = 'marker'

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates)
              .setPopup(popup) // sets a popup on this marker
              .addTo(this.map)
          })
        } catch (err) {}
      }
    }
  }
</script>

<style lang="scss">
  @import 'assets/styles/utilities';
  @import '~bulma/sass/utilities/mixins.sass';
  // @import "~mapbox-gl/dist/mapbox-gl.css";

  #map {
    width:  100%;
    height: 100%;
    position: relative;

    .marker {
      // FIXME: use local graphics!
      background:      url('https://company-16131.frontify.com/api/screen/download/yANNQjWD8CBlyq7i5p12wcMfB_W6GYbKREV4kvZIk9On6uxfu2lwIk_H62lvpe-GOkVlmiiZ8Cpx2OZADp4spQ') no-repeat center;
      background-size: contain;
      width:           30px;
      height:          30px;
      border-radius:   50%;
      cursor:          pointer;
    }

    .mapboxgl-popup {
      max-width: 200px;
    }
  }

</style>
