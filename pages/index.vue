<template>
  <section class="container" style="position: relative">
    <section class="cards" v-cloak="ready">
      <card class="card" v-for="contribution in contributions" :post="contribution" :key="contribution.slug"
            @ready="updateGrid">
        <small slot="category">{{ contribution.type }}</small>
      </card>
    </section>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="waveDots">
      <div slot="no-results">
        <div v-if="!contributions.length" class="has-text-centered">
          <hc-emoji type="cry" width="128"></hc-emoji>
          <h4 class="is-size-4 loader-no-data">Sorry nothing there!</h4>
          <p>
            <small>Try to adjust your search and filters on the top to find what you are searching for.</small>
          </p>
          <br/>
          <div v-if="searchQuery !== ''" class="control has-text-centered">
            <hc-button @click="$store.commit('search/query', '')">Remove "<strong>{{ searchQuery }}</strong>" from Search</hc-button>
          </div>
        </div>
      </div>
      <span slot="no-more">
        <strong class="loader-no-more">There are no more &nbsp;<hc-emoji type="cry" width="26" /></strong>
      </span>
    </infinite-loading>
    <div class="add-contribution">
      <hc-button color="primary" size="large" type="nuxt" to="/contributions/write" circle v-if="isVerified">
        <hc-icon icon="plus"/>
      </hc-button>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import feathers from '~/plugins/feathers'
  import Bricks from 'bricks.js'
  import Card from '~/components/Contributions/ContributionCard.vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  import _ from 'lodash'

  let app
  export default {
    components: {
      'card': Card,
      'infinite-loading': InfiniteLoading
    },
    async asyncData () {
      let sort = {
        createdAt: -1
      }
      let res = await feathers.service('contributions').find({
        query: {
          $sort: sort
        }
      })
      return {
        contributions: res.data,
        limit: res.limit,
        skip: res.limit,
        sort: sort
      }
    },
    data () {
      return {
        bricksInstance: null,
        contributions: null,
        errors: null,
        ready: false,
        limit: null,
        skip: 0,
        sort: {}
      }
    },
    computed: {
      ...mapGetters({
        changeLayout: 'layout/change',
        searchQuery: 'search/query',
        searchCategories: 'search/categoryIds',
        isVerified: 'auth/isVerified'
      })
    },
    watch: {
      changeLayout () {
        const app = this
        app.$nextTick(() => {
          app.updateGrid()
        })
      },
      searchQuery () {
        this.resetList(this)
      },
      searchCategories () {
        this.resetList(this)
      }
    },
    methods: {
      resetList (app) {
        app.$nextTick(async () => {
          app.contributions = []
          app.skip = 0
          app.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          app.onInfinite()
        })
      },
      updateGrid: _.throttle(() => {
        // throttle the grid updates for better performance
        app.bricksInstance.resize(true).pack()
      }, 200),
      onInfinite () {
        let query = {
          $skip: this.skip,
          $sort: this.sort
        }
        if (!_.isEmpty(this.searchQuery)) {
          query.$search = this.searchQuery
        }
        if (!_.isEmpty(this.searchCategories)) {
          query.categoryIds = {
            $in: this.searchCategories
          }
        } else {
          delete query.categoryIds
        }
        feathers.service('contributions').find({query: query}).then(res => {
          this.contributions = _.uniqBy(this.contributions.concat(res.data), '_id')
          this.$nextTick(() => {
            this.updateGrid()

            let lastItemNum = res.data.length + res.skip
            if (lastItemNum < res.total) {
              // do load more
              this.skip = res.skip + res.limit
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            } else {
              // do NOT load more
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          }, 100)
        }).catch(err => {
          throw new Error(500, err.message)
        })
      }
    },
    mounted () {
      app = this
      this.bricksInstance = new Bricks({
        container: '.cards',
        packed: 'data-packed',
        sizes: [
          {columns: 1, gutter: 15},
          {mq: '768px', columns: 2, gutter: 15},
          {mq: '1000px', columns: 3, gutter: 15},
          {mq: '1192px', columns: 3, gutter: 20},
          {mq: '1300px', columns: 3, gutter: 20}
        ]
      })
      // feed the search filters with the current settings
      this.resetList(this)

      this.updateGrid()

      this.ready = true

      window.addEventListener('load', () => {
        this.updateGrid()
      })
      window.addEventListener('resize', _.debounce((e) => {
        if (e.target.innerWidth < 769) {
          this.updateGrid()
        }
      }, 200))
    },
    head () {
      return {
        title: 'Welcome'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'assets/styles/utilities';

  .cards {
    padding: 0;
    margin-left: auto;
    margin-right: auto;

    @include mobile() {
      width: 100% !important;
    }

    &:empty {
      height: 20vh !important;
    }
  }

  .loader-no-data,
  .loader-no-more {
    padding-top: 20px !important;
    color: lighten($grey, 10%);

    img {
      display: inline-block;
      margin-bottom: -0.5rem;
    }
  }

  .add-contribution {
    z-index: 50;
    position: fixed;
    bottom: 50px;
    right: 50px;

    @include mobile() {
      bottom: 25px;
      right: 25px;
    }

    .button {
      box-shadow: 0 20px 60px 0 rgba(0, 0, 0, .35) !important;
      transition: box-shadow, transform;
      transition-duration: 100ms;
      transition-timing-function: ease-in-out;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 20px 60px 0 rgba(0, 0, 0, .35);
      }
    }
  }
</style>
