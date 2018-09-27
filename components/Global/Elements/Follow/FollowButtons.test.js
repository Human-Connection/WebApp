import { shallowMount, createLocalVue } from '@vue/test-utils'
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
      'auth/user': () => { return currentUser }
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

    describe('entity is not blacklisted', () => {
      beforeEach(() => {
        getters['feathers-vuex-usersettings/isBlacklisted'] = () => () => false
        store = new Vuex.Store({
          state: {}, getters, actions
        })
      })

      test('follow button is enabled', () => {
        wrapper = shallowMount(FollowButtons, { store, localVue, propsData, mocks })
        expect(wrapper.find('hc-button-stub').attributes().disabled).toEqual(undefined)
      })
    })

    describe('entity is blacklisted', () => {
      beforeEach(() => {
        getters['feathers-vuex-usersettings/isBlacklisted'] = () => () => true
        store = new Vuex.Store({
          state: {}, getters, actions
        })
      })

      test('follow button is disabled', () => {
        wrapper = shallowMount(FollowButtons, { store, localVue, propsData, mocks })
        expect(wrapper.find('hc-button-stub').attributes().disabled).toEqual('true')
      })
    })
  })
})
