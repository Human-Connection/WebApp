import { mutations, actions } from './comments.js'
import feathers from '@feathersjs/feathers'

let state
let dispatch
let commit

beforeEach(() => {
  dispatch = jest.fn(() => Promise.resolve())
  commit = jest.fn()
  state = { comments: [] }
})

describe('isLoading', () => {
  test('sets status', () => {
    state = {
      status: false
    }
    mutations.isLoading(state, true)
    expect(state.isLoading).toBe(true)
  })
})

describe('given a mock api', () => {
  let action
  let api
  let responseComments = []

  beforeEach(() => {
    api = feathers()
    api.use('/comments', {
      async find () {
        return {
          data: responseComments,
          total: responseComments.length
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
      test('returns without any commit', async () => {
        await action({state, dispatch, commit})
        expect(dispatch).not.toHaveBeenCalled()
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('given a contribution id', () => {
      test('updates the set of preloaded comments', async () => {
        await action({state, dispatch, commit}, 42)
        const expected = [
          [ 'setContributionId', 42 ],
          [ 'setCommentCount', 0 ],
          [ 'setChildCommentCount', 0 ],
          [ 'set', [] ],
          [ 'isLoading', false ]
        ]
        expect(commit.mock.calls).toEqual(expected)
      })

      test('sets comments, commentCount and childCommentCount', async () => {
        responseComments = [{_id: 23, children: [{_id: 24, parentCommentId: 23, children: []}]}]
        await action({state, dispatch, commit}, 42)
        const expected = [
          [ 'setContributionId', 42 ],
          [ 'setCommentCount', 1 ],
          [ 'setChildCommentCount', 1 ],
          [ 'set', [{_id: 23, children: [{_id: 24, parentCommentId: 23, children: []}]}] ],
          [ 'isLoading', false ]
        ]
        expect(commit.mock.calls).toEqual(expected)
      })

      test('returns a promise', () => {
        const aPromise = action({state, dispatch, commit}, 42)
        expect(aPromise).toBeInstanceOf(Promise)
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

    test('calls fetchByContributionId', async () => {
      await action({state, dispatch, commit}, 42)
      expect(dispatch).toHaveBeenCalled()
    })

    test('returns a promise', () => {
      const aPromise = action({state, dispatch, commit}, 42)
      expect(aPromise).toBeInstanceOf(Promise)
    })

    describe('given more comments than already loaded', () => {
      test('calls fetchAllByContributionId recursively', async () => {
        state = { comments: [], commentCount: 3, childCommentCount: 0 }
        await action({state, dispatch, commit}, 42)
        const expected = [
          ['fetchByContributionId', 42],
          ['fetchAllByContributionId', 42]
        ]
        expect(dispatch.mock.calls).toEqual(expected)
      })

      test('returns a promise', () => {
        state = { comments: [], commentCount: 3, childCommentCount: 0 }
        const aPromise = action({state, dispatch, commit}, 42)
        expect(aPromise).toBeInstanceOf(Promise)
      })
    })
  })
})
