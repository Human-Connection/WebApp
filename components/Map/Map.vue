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
          return { lng: -60.0073, lat: 40.7124 }
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
        mapboxgl.accessToken = 'pk.eyJ1Ijoic29ubmVuZmVsZDI2OSIsImEiOiJjajQwMmlvaTEwOXFzMnF0MTM3MjZuY2U0In0.T1X3PSCiYOI87qNi6AYBYw'
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
          new mapboxgl.Marker(el, { offset: [-50 / 2, -50 / 2] })
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
    background-image: url('https://cdn.frontify.com/api/screen/thumbnail/rkPsXqXyMgx05oB1uS5gF9gqTcSy1dwJ9Rmj3WPPE2y9LQh1B3YR7INqFjey_JaqpFaX6HUg-dLeUxq2aKcfxw/1194');
    background-size: cover;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
  }
</style>