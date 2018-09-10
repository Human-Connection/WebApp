import Vue from 'vue'
import _ from 'lodash'
import { Base64 } from 'js-base64'

export default {
  namespaced: true,
  state: {
    contributions: [],
    search: null,
    filter: {
      categoryIds: [],
      emotions: []
    },
    limit: 15,
    skip: 0,
    sortField: 'createdAt',
    sortOrder: 'desc',
    sort: {
      createdAt: -1
    },
    isLoading: false,
    lastQueryHash: null,
    lastQueryDate: null,
    hasNext: false,
    lastScrollPos: null
  },

  mutations: {
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
        if (contribution.deleted) {
          Vue.delete(state.contributions, index)
        } else {
          Vue.set(state.contributions, index, contribution)
        }
      }
    },
    setHasNext (state, hasNext) {
      state.hasNext = hasNext
    },
    setLastScrollPos (state, scrollPos) {
      state.lastScrollPos = scrollPos
    },
    setSortField (state, sortField) {
      state.sortField = sortField
      state.sort = {}
      state.sort[state.sortField] = (state.sortOrder.toLowerCase() === 'desc') ? -1 : 1
    },
    setSortOrder (state, order) {
      state.sortOrder = order
      state.sort = {}
      state.sort[state.sortField] = (state.sortOrder.toLowerCase() === 'desc') ? -1 : 1
    },
    clear (state) {
      state.contributions = []
      state.skip = 0
      state.isLoading = false
      state.hasNext = true
      state.lastQueryHash = null
      state.lastScrollPos = null
    }
  },

  getters: {
    all (state) {
      return state.contributions
    },
    sortField (state) {
      return state.sortField
    },
    sortOrder (state) {
      return state.sortOrder
    },
    getCurrentQueryHash (state, getters, rootState, rootGetters) {
      let queryData = {
        search: state.search,
        filter: state.filter,
        limit: state.limit,
        skip: state.skip,
        sort: state.sort
      }
      if (!_.isEmpty(state.search)) {
        queryData.$sort = {}
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
      if (!_.isEmpty(state.search)) {
        query.$sort = {}
      }
      query = Object.assign(query, rootGetters['search/queryLanguages'])

      // generate the search query with the token entered inside the search field
      if (!_.isEmpty(state.search)) {
        // query.title = { $search: state.search }
        query.$search = state.search
        query.$language = Vue.i18n.locale()
      }
      // generate the category filter query by using the selected category ids
      query = Object.assign(query, rootGetters['search/queryCategories'])

      // generate the emotions filter query by using the selected emotions
      query = Object.assign(query, rootGetters['search/queryEmotions'])

      return query
    }
  },

  actions: {
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
        const res = await this.app.$api.service('contributions').find({query})
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
}
