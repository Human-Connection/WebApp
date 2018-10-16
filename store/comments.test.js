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

describe('fetchByContributionId', () => {
  let action

  beforeEach(() => {
    const api = feathers()
    api.use('/comments', {
      async find () {
        return {
          data: []
        }
      }
    })
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
    test('commits setContributionId', (done) => {
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
  })
})
