import Vue from 'vue'

// require all global components
const req = require.context('../components/Global', true, /\.vue$/)
req.keys().forEach(path => {
  const component = req(path)
  // Create a component name like
  // app-button or list-item out of the components filename
  let name = path.split('/').pop().replace('.vue', '')
  name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  if (!name.includes('-')) {
    name = 'app-' + name
  }
  Vue.component(name, component)
})
