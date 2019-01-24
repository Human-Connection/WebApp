import { mutations, actions } from './comments.js'
import feathers from '@feathersjs/feathers'

let state
let dispatch
let commit


  let someComment = {
    _id: '5be9d1d23f0988002f4bea67',
    content: "<p>I'm content</p>",
    contributionId: '5be988fa50822c002f206580',
    contentExcerpt: "<p>I'm content</p>",
    userId: '5be988d550822c002f206521',
    hasMore: false,
    createdAt: '2018-11-12T19:17:38.068Z',
    updatedAt: '2018-11-12T19:17:38.068Z',
    deleted: false,
    upvoteCount: 0,
    upvotes: [],
    __v: 0
  }

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

describe('updateComment', () => {
  let updatedComment = Object.assign({}, someComment, {
    contentExcerpt: "<p>I'm updated</p>",
    updatedAt: '2018-11-12T19:17:47.785Z'
  })

  test('updates contentExcerpt', () => {
    state = { comments: [someComment] }
    mutations.updateComment(state, updatedComment)
    expect(state.comments[0].contentExcerpt).toBe("<p>I'm updated</p>")
  })

  test('updates updatedAt', () => {
    state = { comments: [someComment] }
    mutations.updateComment(state, updatedComment)
    expect(state.comments[0].updatedAt).toBe('2018-11-12T19:17:47.785Z')
  })

  test('does not crash when no ID is found', () => {
    state = { comments: [someComment] }
    updatedComment = Object.assign({}, someComment, { _id: 'notFound' })
    mutations.updateComment(state, updatedComment)
    expect(state.comments[0].deleted).toBe(true)
  })
})

describe('removeComment', () => {
  let removedComment = {
    _id: '5be9d1d23f0988002f4bea67',
    createdAt: '2018-11-12T19:17:38.068Z',
    updatedAt: '2018-11-12T19:17:38.068Z',
    deleted: true
  }

  test('does not crash when no ID is found', () => {
    state = { comments: [someComment] }
    mutations.removeComment(state, 'notfound')
    expect(state.comments[0].deleted).toBe(true)
  })

  test('marks comment as deleted', () => {
    state = { comments: [someComment] }
    mutations.removeComment(state, '5be9d1d23f0988002f4bea67')
    expect(state.comments[0].deleted).toBe(true)
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

  describe("$api.service('comments').patch returns an updated comment", () => {
    let updatedComment = Object.assign({}, someComment, {
      contentExcerpt: "<p>I'm updated</p>",
      updatedAt: '2018-11-12T19:17:47.785Z'
    })

    beforeEach(() => {
      api.use('/comments', { async patch () { return updatedComment } })
      const module = { app: { $api: api } }
      action = actions.patch.bind(module)
    })

    describe('patch', () => {
      it('commits the api response comment', async () => {
        await action({state, dispatch, commit}, { _id: 'whatever' })
        const expected = [ [ 'updateComment', updatedComment ] ]
        expect(commit.mock.calls).toEqual(expected)
      })
    })
  })

  describe("$api.service('comments').remove returns an updated comment", () => {
    let updatedComment = Object.assign({}, someComment, { deleted: true })

    beforeEach(() => {
      api.use('/comments', { async remove () { return updatedComment } })
      const module = { app: { $api: api } }
      action = actions.remove.bind(module)
    })

    describe('remove', async () => {
      it('commits the api response comment', async () => {
        await action({state, dispatch, commit}, { _id: 'whatever' })
        const expected = [ [ 'removeComment', updatedComment ] ]
        expect(commit.mock.calls).toEqual(expected)
      })
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
          [ 'set', [] ],
          [ 'isLoading', false ]
        ]
        expect(commit.mock.calls).toEqual(expected)
      })

      test('sets comments and commentCount', async () => {
        responseComments = [{_id: 23}]
        await action({state, dispatch, commit}, 42)
        const expected = [
          [ 'setContributionId', 42 ],
          [ 'setCommentCount', 1 ],
          [ 'set', [{_id: 23}] ],
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
        state = { comments: [], commentCount: 3 }
        await action({state, dispatch, commit}, 42)
        const expected = [
          ['fetchByContributionId', 42],
          ['fetchAllByContributionId', 42]
        ]
        expect(dispatch.mock.calls).toEqual(expected)
      })

      test('returns a promise', () => {
        state = { comments: [], commentCount: 3 }
        const aPromise = action({state, dispatch, commit}, 42)
        expect(aPromise).toBeInstanceOf(Promise)
      })
    })
  })
})
