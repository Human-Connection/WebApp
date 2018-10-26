import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Comment from './Comment'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()

const propsData = {
  onUpvote: () => {},
  comment: {_id: 42, contentExcerpt: 'Excerpt conte..'}
}

const mocks = { $t: () => {} }

describe('Comment.vue', () => {
  let actions
  let getters
  let store
  let wrapper

  beforeEach(() => {
    getters = {
      'comments/showComment': () => 0,
      'auth/user': () => {_id: 2}
    }
    actions = {
      'comments/fetchById': jest.fn(),
      'comments/remove': jest.fn(),
      'comments/patch': jest.fn()
    }
    store = new Vuex.Store({
      state: {}, getters, actions
    })
    wrapper = shallowMount(Comment, { store, localVue, propsData, mocks, router })
  })

  describe('if deleted', () => {
    beforeEach(() => {
      const propsData = {
        onUpvote: () => {},
        comment: {_id: 42, contentExcerpt: 'Excerpt conte..', deleted: true}
      }
      wrapper = shallowMount(Comment, { store, localVue, propsData, mocks, router })
    })
    test('shows visible placeholder', () => {
      expect(wrapper.find('.comment-main').classes()).toContain('comment-deleted')
    })
  })

  test('comment deleted is not shown', () => {
    expect(wrapper.find('.comment-deleted-icon').exists()).toBeFalsy()
    expect(wrapper.find('.comment-deleted').exists()).toBeFalsy()
  })

  test('comment main has class depth-zero', () => {
    expect(wrapper.props().depth).toBe(0)
    expect(wrapper.find('.comment-main').classes()).toContain('depth-zero')
  })

  test('comment-text', () => {
    expect(wrapper.find('.comment-text').text()).toBe(propsData.comment.contentExcerpt)
  })

  describe('depth is 1', () => {
    beforeEach(() => {
      const propsData = {
        onUpvote: () => {},
        comment: {_id: 42, contentExcerpt: 'Excerpt conte..'},
        depth: 1
      }
      wrapper = shallowMount(Comment, { store, localVue, propsData, mocks, router })
    })
    test('comment-main has class depth-one', () => {
      expect(wrapper.find('.comment-main').classes()).toContain('depth-one')
    })
  })
})
