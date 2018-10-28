import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Comments from './Comments'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()

const propsData = {
  post: {
    _id: 4711,
    name: 'author',
    userId: 42
  }
}

const mocks = { $t: () => {} }

describe('Comments.vue', () => {
  let actions
  let getters
  let store
  let wrapper

  beforeEach(() => {
    getters = {
      'comments/isLoading': () => true,
      'comments/count': () => 1,
      'comments/childCount': () => 0,
      'comments/all': () => [{ _id: 23, userId: 42, children: [] }],
      'auth/user': () => Object.assign({}, { _id: 42 })
    }
    actions = {
      'comments/fetchAllByContributionId': jest.fn(),
      'comments/fetchByContributionId': jest.fn(),
      'comments/subscribe': jest.fn()
    }
    store = new Vuex.Store({
      state: {}, getters, actions
    })
    wrapper = shallowMount(Comments, { store, localVue, propsData, mocks, router })
  })

  describe('is loading comments', () => {
    test('isCommentFormOfContribution', () => {
      expect(wrapper.find('#comment-form').props('isCommentFormOfContribution')).toBeTruthy()
    })

    test('shows notification', () => {
      expect(wrapper.find('.notification').exists()).toBeTruthy()
    })
  })

  describe('comments loaded', () => {
    beforeEach(() => {
      getters['comments/isLoading'] = () => false
      getters['comments/count'] = () => 2
      store = new Vuex.Store({
        state: {}, getters, actions
      })
      wrapper = shallowMount(Comments, { store, localVue, propsData, mocks, router })
    })
    test('notification is not rendered and reply comment is set', () => {
      wrapper.setData({replyComment: {_id: 23, userId: 42, children: []}})
      expect(wrapper.find('.notification').exists()).toBeFalsy()
      expect(wrapper.vm.replyComments).toHaveLength(1)
    })
    test('comment and load comments button is rendered', () => {
      expect(wrapper.find('hc-comment-stub').exists()).toBeTruthy()
      expect(wrapper.find('hc-button-stub').exists()).toBeTruthy()
    })
  })
})
