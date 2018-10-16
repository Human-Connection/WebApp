import { mutations, actions } from './comments.js'
import { testActionJest as testAction } from '~/test/helpers/testAction.js'

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
  describe('no given contribution id', () => {
    test('returns without any commit', (done) => {
      testAction(actions.fetchByContributionId, null, {}, [], done)
    })
  })
})
