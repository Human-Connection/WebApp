import Vue from 'vue'
import VueClickOutside from 'vue-click-outside'
Vue.directive('click-outside', VueClickOutside)

// Register a global custom directive called `v-focus`
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding) {
    // Focus the element
    Vue.nextTick(() => {
      if (binding.value !== false) {
        el.focus()
      }
    })
  }
})
