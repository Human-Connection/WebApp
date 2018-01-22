import feathers from '~/plugins/feathers'
import Vue from 'vue'
import _ from 'lodash'
import { Base64 } from 'js-base64'

export const state = () => {
  return {
    contributions: [],
    search: null,
    filter: {
      categoryIds: [],
      emotions: []
    },
    limit: 15,
    skip: 0,
    sort: {
      createdAt: -1
    },
    isLoading: false,
    lastQueryHash: null,
    hasNext: false,
    lastScrollPos: null
  }
}

export const mutations = {
  setLoading (state, isLoading) {
    state.isLoading = isLoading
  },
  movePaginationCursor (state) {
    if (state.contributions.length) {
      state.skip = state.skip + state.limit
    } else {
      state.skip = 0
    }
  },
  setLastQueryHash (state, queryHash) {
    state.lastQueryHash = queryHash
  },
  setSearch (state, value) {
    state.search = value
  },
  addContributions (state, contributions) {
    state.contributions = _.uniqBy(state.contributions.concat(contributions), '_id')
  },
  updateContribution (state, contribution) {
    if (!state.contributions.length) return
    let index = state.contributions.findIndex(item => {
      return item._id === contribution._id
    })
    if (index < 0) return
    state.contributions.splice(index, 1, contribution)
  },
  setHasNext (state, hasNext) {
    state.hasNext = hasNext
  },
  setLastScrollPos (state, scrollPos) {
    state.lastScrollPos = scrollPos
  },
  clear (state) {
    state.contributions = []
    state.skip = 0
    state.isLoading = false
    state.hasNext = true
  }
}

export const getters = {
  all (state) {
    return state.contributions
  },
  getCurrentQueryHash (state) {
    const hash = JSON.stringify({
      search: state.search,
      filter: state.filter,
      limit: state.limit,
      skip: state.skip,
      sort: state.sort
    })
    return Base64.encode(hash)
  },
  isLoading (state) {
    return state.isLoading
  },
  hasNext (state) {
    return state.hasNext
  },
  lastScrollPos (state) {
    return state.lastScrollPos
  },
  getCurrentQuery (state) {
    let query = {
      $skip: state.skip,
      $limit: state.limit,
      $sort: state.sort
    }
    // generate the search query with the token entered inside the search field
    if (!_.isEmpty(state.search)) {
      // query.title = { $search: state.search }
      query.$search = state.search
      query.$language = Vue.i18n.locale()
    }
    // generate the category filter quiery by using the selected category ids
    if (!_.isEmpty(state.filter.categoryIds)) {
      query.categoryIds = {
        $in: state.filter.categoryIds
      }
    } else {
      delete query.categoryIds
    }
    // generate the emotons filter query by using the selected emotions
    if (!_.isEmpty(state.filter.emotions)) {
      query.$and = []
      _.xor(state.filter.emotions, ['funny', 'happy', 'surprised', 'cry', 'angry']).forEach((emotion) => {
        let obj = {}
        obj[`emotions.${emotion}.percent`] = {$lt: 20}
        query.$and.push(obj)
      })
      if (_.isEmpty(query.$and)) {
        delete query.$and
      }
    } else {
      delete query.$and
    }
    console.log(query)
    return query
  }
}

export const actions = {
  /**
   * fetch all contributions for the given query and filter settings
   */
  async fetch ({state, getters, commit}) {
    if (state.isLoading === true) {
      console.log('FETCH CANCELED AS THERE IS SOMETHING LOADING...')
      return
    }
    commit('setLoading', true)

    // return current data if query is the same like the last one
    const queryHash = getters.getCurrentQueryHash
    if (!_.isEmpty(queryHash) && queryHash === state.lastQueryHash && state.contributions.length) {
      console.log('#LOAD FROM CACHE')
      setTimeout(() => {
        commit('setLoading', false)
      }, 150)
      return state.contributions
    }

    const query = getters.getCurrentQuery

    commit('setLastQueryHash', queryHash)

    try {
      const res = await feathers.service('contributions').find({query: query})
      commit('addContributions', res.data)

      setTimeout(() => {
        const lastItemNum = res.data.length + res.skip
        commit('setHasNext', lastItemNum < res.total)
        setTimeout(() => {
          commit('setLoading', false)
        }, 150)
      }, 500)
    } catch (err) {
      commit('setLoading', false)
      throw new Error(500, err.message)
    }
  },
  /**
   * load more entries for the given query and filter settings
   */
  fetchMore ({state, dispatch, commit}) {
    if (state.isLoading === true) {
      console.log('FETCHMORE CANCELED AS THERE IS SOMETHING LOADING...')
      return
    }
    commit('movePaginationCursor')
    dispatch('fetch')
  }
}
