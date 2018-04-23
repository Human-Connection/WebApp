import Vue from 'vue'
import _ from 'lodash'
import { Base64 } from 'js-base64'

/**
 * build the $and or $or query from the given parameters
 *
 * @param {Array}  diff     emotions
 * @param {Object} query    query object
 * @param {String} mode     $and, $or
 * @param {String} compare  $lt, $gt
 */
const buildQueryEmotions = function (diff, query, mode, compare) {
  diff.forEach((emotion) => {
    let obj = {}
    obj[`emotions.${emotion}.percent`] = {}
    obj[`emotions.${emotion}.percent`][compare] = 20 // $lt or $gt
    if (!query[mode]) {
      query[mode] = []
    }
    query[mode].push(obj)
  })
}

/**
 * build the emotion filter query based on the selected emotions and on the mode (exclude / include)
 *
 * @param {Array}   emotions
 * @param {Object}  query
 * @param {Boolean} exclude
 */
const buildFilterEmotions = function (emotions, query, exclude = true) {
  const all = ['funny', 'happy', 'surprised', 'cry', 'angry']
  if (_.isEmpty(emotions) || emotions.length === all.length) {
    return
  }

  const queryObj = {}
  if (exclude) {
    // use exclude method
    buildQueryEmotions(_.xor(emotions, all), queryObj, '$and', '$lt')
    buildQueryEmotions(_.intersection(emotions, all), queryObj, '$or', '$gt')
  } else {
    // use include method when less then the half of the emotions are selected
    buildQueryEmotions(_.intersection(emotions, all), queryObj, '$or', '$gt')
  }

  if (!_.isEmpty(queryObj)) {
    query = Object.assign(query, queryObj)
  }
}

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
    lastQueryDate: null,
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
    if (state.lastQueryHash !== queryHash) {
      state.lastQueryDate = new Date()
    }
    state.lastQueryHash = queryHash
  },
  setSearch (state, value) {
    state.search = value
  },
  setFilter (state, value) {
    state.filter = value
  },
  addContributions (state, contributions) {
    state.contributions = _.uniqBy(state.contributions.concat(contributions), '_id')
  },
  updateContribution (state, contribution) {
    const index = _.findIndex(state.contributions, { _id: contribution._id })
    if (index >= 0) {
      Vue.set(state.contributions, index, contribution)
    }
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
    state.lastQueryHash = null
    state.lastScrollPos = null
  }
}

export const getters = {
  all (state) {
    return state.contributions
  },
  getCurrentQueryHash (state, getters, rootState, rootGetters) {
    let queryData = {
      search: state.search,
      filter: state.filter,
      limit: state.limit,
      skip: state.skip,
      sort: state.sort
    }
    if (rootState.auth.user) {
      queryData.language = {
        $in: _.castArray(rootGetters['auth/userSettings'].contentLanguages)
      }
    }
    const hash = JSON.stringify(queryData)
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
  getCurrentQuery (state, getters, rootState, rootGetters) {
    let query = {
      $skip: state.skip,
      $limit: state.limit,
      $sort: state.sort,
      visibility: 'public'
    }
    if (rootState.auth.user) {
      query.language = {
        $in: _.castArray(rootGetters['auth/userSettings'].contentLanguages)
      }
    }
    // generate the search query with the token entered inside the search field
    if (!_.isEmpty(state.search)) {
      // query.title = { $search: state.search }
      query.$search = state.search
      query.$language = Vue.i18n.locale()
    }
    // generate the category filter query by using the selected category ids
    if (!_.isEmpty(state.filter.categoryIds)) {
      query.categoryIds = {
        $in: state.filter.categoryIds
      }
    } else {
      delete query.categoryIds
    }

    // generate the emotions filter query by using the selected emotions
    buildFilterEmotions(state.filter.emotions, query)

    return query
  }
}

export const actions = {
  // Called from plugins/init-store-subscriptions only once
  subscribe ({state, commit}) {
    return this.app.$api.service('contributions')
      .on('patched', (res) => {
        commit('updateContribution', res)
      })
  },
  /**
   * fetch all contributions for the given query and filter settings
   */
  async fetch ({state, getters, commit}) {
    if (state.isLoading === true) {
      // console.log('FETCH CANCELED AS THERE IS SOMETHING LOADING...')
      return
    }
    commit('setLoading', true)

    // return current data if query is the same like the last one
    const queryHash = getters.getCurrentQueryHash
    if (!_.isEmpty(queryHash) && queryHash === state.lastQueryHash && state.contributions.length) {
      // console.log('#LOAD FROM CACHE')
      setTimeout(() => {
        commit('setLoading', false)
      }, 150)
      return state.contributions
    }

    const query = getters.getCurrentQuery

    commit('setLastQueryHash', queryHash)

    try {
      const res = await this.app.$api.service('contributions').find({query: query})
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
      // console.log('FETCHMORE CANCELED AS THERE IS SOMETHING LOADING...')
      return
    }
    commit('movePaginationCursor')
    dispatch('fetch')
  }
}
