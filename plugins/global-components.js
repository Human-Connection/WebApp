import Vue from 'vue'

// Creates a component name like
// hc-button or hc-list-item from components filename
const getComponentName = (path) => {
  let pathElements = path.split('/')
  pathElements.pop()
  let name = pathElements.pop()
  name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  name = 'hc-' + name
  return name
}

// require all global components
const req = require.context('~/components/Global', true, /\.vue$/)

let globalComponents = {}
req.keys().forEach(path => {
  const component = req(path)
  let name = getComponentName(path)
  Vue.component(name, component.default)
})

export default ({ app }) => (
  app.globalComponents = () => {
    return globalComponents
  }
)
