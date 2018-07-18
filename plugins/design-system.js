import Vue from 'vue'

// Defines contexts to require
// (you should remove templates from this if not used in production)
const contexts = [
  require.context('@@/elements/', true, /\.vue$/),
  require.context('@@/patterns/', true, /\.vue$/),
  require.context('@@/templates/', true, /\.vue$/)
]

const components = []
contexts.forEach(context => {
  context.keys().forEach(key => components.push(context(key).default))
})

components.forEach(c => Vue.component(c.name, c))
