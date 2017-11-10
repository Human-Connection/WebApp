<template>
  <div id="map" width="200px"></div>
</template>

<script>
  import NoSSR from 'vue-no-ssr'
  
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
    components: {
      'no-ssr': NoSSR
    },
    name: 'hc-map',
    mounted () {
      this.createMap()
    },
    methods: {
      createMap () {
        const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
        mapboxgl.accessToken = process.env.MAPBOX_TOKEN
        // init the map
        let map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v10',
          zoom: this.zoom,
          center: this.center
        })
        this.places.forEach(function (marker) {
          // create a HTML element for each feature
          let el = document.createElement('div')
          el.className = 'marker'

          // make a marker for each feature and add to the map
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map)
        })
      }
    }
  }
</script>

<style lang="scss">
  // @import "mapbox-gl/dist/mapbox-gl.css";

  #map {
    height: 200px;
  }
  
  .marker {
    background:      url('https://company-16131.frontify.com/api/screen/download/yANNQjWD8CBlyq7i5p12wcMfB_W6GYbKREV4kvZIk9On6uxfu2lwIk_H62lvpe-GOkVlmiiZ8Cpx2OZADp4spQ') no-repeat center;
    background-size: contain;
    width:           30px;
    height:          30px;
    border-radius:   50%;
    cursor:          pointer;
  }
</style>