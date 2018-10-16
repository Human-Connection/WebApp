import { mutations, actions } from './comments.js'
import { testActionJest as testAction } from '~/test/helpers/testAction.js'
import feathers from '@feathersjs/feathers'

describe('isLoading', () => {
  test('sets status', () => {
    const state = {
      status: false
    }
    mutations.isLoading(state, true)
    expect(state.isLoading).toBe(true)
  })
})

describe('fetch', () => {
  let action
  let comments = []
  let api

  beforeEach(() => {
    api = feathers()
    api.use('/comments', {
      async find () {
        return {
          data: comments,
          total: comments.length
        }
      }
    })
  })

  describe('fetchByContributionId', () => {
    beforeEach(() => {
      const module = { app: { $api: api } }
      action = actions.fetchByContributionId.bind(module)
    })

    afterEach(() => {
      action = null
    })

    describe('no given contribution id', () => {
      test('returns without any commit', (done) => {
        testAction(action, null, {}, [], done)
      })
    })

    describe('given a contribution id', () => {
      test('updates the set of preloaded comments', (done) => {
        const state = {
          comments: []
        }
        testAction(action, 42, state, [
          { type: 'setContributionId', payload: 42 },
          { type: 'set', payload: [] },
          { type: 'setCommentCount', payload: 0 },
          { type: 'isLoading', payload: false }
        ], done)
      })

      test('sets comments and commentCount', (done) => {
        const state = {
          comments: []
        }
        comments = [{_id: 23}]
        testAction(action, 42, state, [
          { type: 'setContributionId', payload: 42 },
          { type: 'set', payload: [{_id: 23}] },
          { type: 'setCommentCount', payload: 1 },
          { type: 'isLoading', payload: false }
        ], done)
      })
    })
  })

  describe('fetchAllByContributionId', () => {
    beforeEach(() => {
      const module = { app: { $api: api } }
      action = actions.fetchAllByContributionId.bind(module)
    })

    afterEach(() => {
      action = null
    })

    test('behaves similar to fetchByContributionId', (done) => {
      const state = {
        comments: []
      }
      comments = [{_id: 23}]
      testAction(action, 42, state, [
        { type: 'setContributionId', payload: 42 },
        { type: 'set', payload: [{_id: 23}] },
        { type: 'setCommentCount', payload: 1 },
        { type: 'isLoading', payload: false }
      ], done)
    })

    describe('given too many comments', () => {
      let step
      beforeEach(() => {
        step = 0
        api.use('/comments', {
          async find () {
            step++
            return {
              data: comments[step],
              total: 3
            }
          }
        })
      })
    })
  })
})
