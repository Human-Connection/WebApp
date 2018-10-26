import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import CommentForm from './CommentForm'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()

const propsData = {
  onUpvote: () => {},
  post: {
    _id: 1,
    userId: 2
  },
  isCommentFormOfContribution: true
}

const mocks = { $t: () => {}, $snackbar: { open: jest.fn()}, $toast: { open: jest.fn()}}

describe('CommentForm.vue', () => {
  let actions
  let getters
  let store
  let wrapper
  let replyStub

  beforeEach(() => {
    getters = {
      'auth/isVerified': () => true,
      'auth/user': () => {_id: 2},
      'comments/isSubmitting': () => false
    }
    actions = {
      'comments/setSubmitting': jest.fn(),
      'comments/create': jest.fn()
    }
    store = new Vuex.Store({
      state: {}, getters, actions
    })
    replyStub = sinon.stub(CommentForm.methods, 'reply')
    wrapper = shallowMount(CommentForm, { store, localVue, propsData, mocks, router })
  })

  afterEach(() => {
    replyStub.restore()
  })

  test('is rendered', () => {
    expect(wrapper.is('div')).toBeTruthy()
    expect(wrapper.find('hc-avatar-stub').exists()).toBeTruthy()
    expect(wrapper.find('button[type=submit]').attributes('disabled')).toBe('disabled')
  })

  test('submit button is enabled', () => {
    wrapper.setData({ form: { content: 'Some text for a comment', contributionId: 1}})
    expect(wrapper.find('button[type=submit]').attributes('disabled')).toBeUndefined()
  })

  test('submit button is enabled and after cancel disabled again', () => {
    wrapper.setData({ form: { content: 'Some text for a comment', contributionId: 1}})
    expect(wrapper.find('button[type=submit]').attributes('disabled')).toBeUndefined()
    wrapper.find('button[type=button]').trigger('click')
    expect(wrapper.find('button[type=submit]').attributes('disabled')).toBe('disabled')
  })

  test('submitted a comment', async() => {
    wrapper.setData({ form: { content: 'Some text for a comment', contributionId: 1}})
    wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(actions['comments/setSubmitting']).toHaveBeenCalled()
    expect(actions['comments/create']).toHaveBeenCalled()
  })
})
