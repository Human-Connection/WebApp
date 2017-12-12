<template>
  <div class="map-wrapper" :style="{width: width, height: height}">
    <div v-if="isLoading" class="is-loading" :style="{height: height}">&nbsp;</div>
    <div id="map"></div>
  </div>
</template>

<script>
  export default {
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
        type: [String]
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
        isLoading: true
      }
    },
    name: 'hc-map',
    mounted () {
      if (window) {
        setTimeout(this.createMap, 1000)
      }
    },
    methods: {
      createMap () {
        const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
        mapboxgl.accessToken = process.env.MAPBOX_TOKEN || this.token
        // init the map
        let map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v10',
          zoom: this.zoom,
          center: this.center
        })
        map.on('data', (e) => {
          if (e.isSourceLoaded) {
            this.isLoading = false
            map.off('data')
          }
        })

        this.places.forEach(function (marker) {
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
            .addTo(map)
        })
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