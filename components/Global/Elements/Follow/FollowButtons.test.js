import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import FollowButtons from './FollowButtons'

const localVue = createLocalVue()

localVue.use(Vuex)

const propsData = {
  entity: {
    _id: 4711,
    name: 'author'
  }
}

const mocks = { $t: () => {} }

describe('FollowButtons.vue', () => {
  let wrapper
  let actions
  let getters
  let store
  let currentUser

  beforeEach(() => {
    currentUser = {
      _id: 42
    }
    getters = {
      'auth/user': () => { return currentUser },
    }
    actions = {
      'connections/syncFollow': () => {
      }
    }
    store = new Vuex.Store({
      state: {}, getters, actions
    })
  })

  test('renders', () => {
    wrapper = shallowMount(FollowButtons, { store, localVue, propsData, mocks })
    expect(wrapper.is('div')).toBeTruthy()
  })
})
