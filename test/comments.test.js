import test from 'ava'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Comments from '../components/Comments/Comments.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()
let store

test.beforeEach(() => {
  const getters = {
    'auth/isVerified': () => true,
    'auth/user': () => { return {} },
    'comments/all': () => [],
    'comments/count': () => 0,
    'comments/isLoading': () => false
  }
  const actions = {
    'comments/fetchByContributionId': () => [],
    'comments/subscribe': () => {}
  }
  store = new Vuex.Store({
    getters,
    actions
  })
})
function shallow (Component, props) {
  return shallowMount(Component, {
    store,
    localVue,
    propsData: props,
    router
  })
}

test('lol', t => {
  shallow(Comments, {
    post: {},
    user: {},
    comments: []
  })

  t.true(true)
})
