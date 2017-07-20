# Map example

```
new Vue({
  components: {
    'hc-map': require('~components/Map/Map.vue')
  },
  data () {
    return {
      places: [{
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
      }],
      zoom: 3,
      center: {
        lng: -99.0073,
        lat: 40.7124
      }
    }
  },
  template: `<hc-map :places="places" :zoom="zoom" :center="center" />`
})
```