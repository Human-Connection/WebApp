import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import FollowButtons from './FollowButtons'

const localVue = createLocalVue()

localVue.use(Vuex)

let propsData

const mocks = { $t: () => {} }

describe('FollowButtons.vue', () => {
  let wrapper
  let actions
  let getters
  let store
  let currentUser

  beforeEach(() => {
    propsData = {
      entity: {
        _id: 4711,
        name: 'author'
      }
    }
    currentUser = {
      _id: 42
    }
    getters = {
      'connections/follow': () => {
        return { isPending: false, isFollowing: false }
      },
      'feathers-vuex-usersettings/current': () => { return {} },
      'feathers-vuex-usersettings/isPending': () => false,
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

  describe('showButtons === true', () => {
    beforeEach(() => {
      propsData.showButtons = true
    })

    describe('click', () => {
      test('calls `click` method', () => {
        const methods = {
          click: jest.fn()
        }
        wrapper = mount(FollowButtons, { store, localVue, propsData, mocks, methods })
        wrapper.find('button').trigger('click')
        expect(methods.click).toHaveBeenCalled()
      })
    })
  })
})
