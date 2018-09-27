import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BlockButton from './BlockButton'

const localVue = createLocalVue()

localVue.use(Vuex)

const propsData = {
  foreignEntity: {
    _id: 4711,
    name: 'author'
  },
  isFollowing: false
}

const mocks = { $t: () => {} }

describe('BlockButton.vue', () => {
  let actions
  let getters
  let store
  let wrapper

  beforeEach(() => {
    getters = {
      'feathers-vuex-usersettings/isBlacklisted': () => () => false,
      'feathers-vuex-usersettings/isPending': () => false,
      'feathers-vuex-usersettings/current': () => { return { blacklist: [] } }
    }
    actions = {
      'feathers-vuex-usersettings/toggleBlacklist': jest.fn()
    }
    store = new Vuex.Store({
      state: {}, getters, actions
    })
  })

  test('renders', () => {
    wrapper = shallowMount(BlockButton, { store, localVue, propsData, mocks })
    expect(wrapper.is('hc-button-stub')).toBeTruthy()
  })

  describe('request pending', () => {
    beforeEach(() => {
      getters['feathers-vuex-usersettings/isPending'] = () => true
      store = new Vuex.Store({state: {}, getters, actions})
      wrapper = shallowMount(BlockButton, { store, localVue, propsData, mocks })
    })

    test('shows a loading spinner', () => {
      expect(wrapper.find('hc-button-stub').attributes().isloading).toBeTruthy()
    })

    test('is disabled', () => {
      expect(wrapper.find('hc-button-stub').attributes().disabled).toBeTruthy()
    })
  })

  describe('no request pending', () => {
    test('is enabled', () => {
      wrapper = shallowMount(BlockButton, { store, localVue, propsData, mocks })
      expect(wrapper.findAll('hc-button-stub')).toHaveLength(1)
      expect(wrapper.find('hc-button-stub').attributes()).toEqual(expect.not.objectContaining({isloading: 'true'}))
    })

    describe('not blacklisted', () => {
      test('shows a neutral ban icon', () => {
        expect(wrapper.find('hc-icon-stub').classes()).not.toContain('is-danger')
      })
    })

    describe('is blacklisted', () => {
      beforeEach(() => {
        getters['feathers-vuex-usersettings/isBlacklisted'] = () => () => true
        store = new Vuex.Store({state: {}, getters, actions})
        wrapper = shallowMount(BlockButton, { store, localVue, propsData, mocks })
      })

      test('gives visual feedback with a red colour', () => {
        expect(wrapper.find('hc-icon-stub').classes()).toContain('is-danger')
      })
    })

    test('dispatches feathers-vuex-usersettings/toggleBlacklist on click', () => {
      wrapper = mount(BlockButton, {
        store,
        localVue,
        mocks: {
          $t: () => {},
          $snackbar: {
            open () { }
          }
        },
        propsData
      })
      wrapper.find('button').trigger('click')
      expect(actions['feathers-vuex-usersettings/toggleBlacklist']).toHaveBeenCalled()
    })

    describe('isFollowed === true', () => {
      beforeEach(() => {
        const props = Object.assign({}, propsData, {
          isFollowing: true
        })
        wrapper = shallowMount(BlockButton, { store, localVue, propsData: props, mocks })
      })

      test('is disabled', () => {
        expect(wrapper.find('hc-button-stub').attributes().disabled).toEqual('true')
      })
    })

    describe('isFollowed === false', () => {
      beforeEach(() => {
        const props = Object.assign({}, propsData, {
          isFollowing: false
        })
        wrapper = shallowMount(BlockButton, { store, localVue, propsData: props, mocks })
      })

      test('is disabled', () => {
        expect(wrapper.find('hc-button-stub').attributes().disabled).toEqual(undefined)
      })
    })
  })
})
