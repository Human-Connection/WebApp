<template>
  <div id="map" width="200px"></div>
</template>

<script>
  import NoSSR from 'vue-no-ssr'
  
  var geojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }]
  }
  
  export default {
    head: {
      link: [{
        rel: 'stylesheet',
        href: 'https://api.mapbox.com/mapbox-gl-js/v0.38.0/mapbox-gl.css'
      }]
    },
    components: {
      'no-ssr': NoSSR
    },
    name: 'MapBox',
    mounted () {
      this.createMap()
      // this.loadUserEvents()
    },
    computed: {
      location () {
        // console.log(this.$store.state.location)
      }
    },
    methods: {
      createMap: () => {
        const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
        mapboxgl.accessToken = 'pk.eyJ1Ijoic29ubmVuZmVsZDI2OSIsImEiOiJjajQwMmlvaTEwOXFzMnF0MTM3MjZuY2U0In0.T1X3PSCiYOI87qNi6AYBYw'
        // init the map
        let map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v10',
          zoom: 16,
          center: [-74.0073, 40.7124]
        })
        geojson.features.forEach(function (marker) {
          console.log('MARKER IS', marker)
          // create a HTML element for each feature
          var el = document.createElement('div')
          el.className = 'marker'

          // make a marker for each feature and add to the map
          new mapboxgl.Marker(el, { offset: [-50 / 2, -50 / 2] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map)
        })
      },
      loadUserEvents: () => {
      }
    }
  }
</script>

<style>
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