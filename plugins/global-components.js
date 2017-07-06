import Vue from 'vue'
import merge from 'deepmerge'

const getComponentTitle = (path) => {
  let name = path.split('/').pop().replace('.vue', '')
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2')
  return name
}

// Creates a component name like
// hc-button or hc-list-item out of the components filename
const getComponentName = (path) => {
  let pathElements = path.split('/')
  pathElements.pop()
  let name = pathElements.pop()
  name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  name = 'hc-' + name
  return name
}

// require all global components
const req = require.context('../components/Global', true, /\.vue$/)

let globalComponents = {}
req.keys().forEach(path => {
  const component = req(path)
  let name = getComponentName(path)
  let title = getComponentTitle(path)
  const componentData = {
    title: title,
    name: name,
    path: path,
    description: component.description,
    examples: component.examples,
    props: component.props
  }

  if (!globalComponents[name]) {
    globalComponents[name] = {}
  }

  if (title === 'Readme') {
    const readmeName = `${name}-readme`
    globalComponents[name].readme = readmeName
    Vue.component(readmeName, component)
  } else {
    const mergedData = merge.all([
      globalComponents[name],
      componentData
    ])
    globalComponents[name] = mergedData
    Vue.component(name, component)
  }
})

export default ({ app }) => (
  app.globalComponents = () => {
    return globalComponents
  }
)
