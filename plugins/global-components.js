import Vue from 'vue'

// Creates a component name like
// hc-button or hc-list-item out of the components filename
const getComponentName = (path) => {
  let name = path.split('/').pop().replace('.vue', '')
  name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  name = 'hc-' + name
  return name
}

// require all global components
const req = require.context('../components/Global', true, /\.vue$/)

let globalComponents = []
req.keys().forEach(path => {
  const component = req(path)
  let name = getComponentName(path)
  const componentData = {
    name: name,
    path: path,
    description: component.description,
    examples: component.examples,
    props: component.props
  }
  globalComponents.push(componentData)
  Vue.component(name, component)
})

export default ({ app }) => (
  app.globalComponents = () => {
    return globalComponents
  }
)
