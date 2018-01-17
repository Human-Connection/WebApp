<template>
    <section class="container" style="position: relative">
        <section class="cards" v-cloak="ready">
            <card v-for="contribution in contributions"
                  :post="contribution"
                  :key="contribution._id"
                  class="card"
                  @click.native="saveScrollPos"
                  @ready="updateGrid">
                <small slot="category">{{ $t('component.contribution.type-' + contribution.type) }}</small>
            </card>
        </section>
        <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
            <div slot="no-results">
                <div v-if="!contributions.length" class="has-text-centered">
                    <hc-emoji type="cry" width="128"></hc-emoji>
                    <h4 class="is-size-4 loader-no-data">{{ $t('component.search.noResults', 'Sorry nothing there!') }}</h4>
                    <p>{{ $t('component.search.noResultsText') }}</p><br/>
                    <div v-if="searchQuery && searchQuery.trim() !== ''" class="control has-text-centered">
                        <hc-button @click="$store.commit('search/query', '')" v-html="$t('component.search.noResultsResetQueryButton', { searchQuery: searchQuery })"></hc-button>
                    </div>
                </div>
                <strong v-else class="loader-no-data">{{ $t('component.search.noMoreResults') }} &nbsp;<hc-emoji type="cry" width="26"/>
                </strong>
            </div>
            <div slot="no-more">
                <strong class="loader-no-more">{{ $t('component.search.noMoreResults') }} &nbsp;<hc-emoji type="cry" width="26"/>
                </strong>
            </div>
            <div slot="spinner" class="loader-spinner">
                <div class="is-loading"></div>
            </div>
        </infinite-loading>
        <div class="add-contribution">
            <hc-tooltip :label="$t('component.contribution.writePost')" type="is-black">
                <hc-button color="primary" size="large" type="nuxt" to="/contributions/write" circle v-if="isVerified">
                    <hc-icon icon="plus"/>
                </hc-button>
            </hc-tooltip>
        </div>
    </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Bricks from 'bricks.js'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  import _ from 'lodash'

  const ContributionCard = () => import('~/components/Contributions/ContributionCard.vue')

  let app
  export default {
    components: {
      'card': ContributionCard,
      'infinite-loading': InfiniteLoading
    },
    async asyncData ({store}) {
      await store.dispatch('newsfeed/fetch')
    },
    data () {
      return {
        bricksInstance: null,
        errors: null,
        ready: false
      }
    },
    computed: {
      ...mapGetters({
        changeLayout: 'layout/change',
        searchQuery: 'search/query',
        searchCategories: 'search/categoryIds',
        searchEmotions: 'search/emotions',
        isVerified: 'auth/isVerified',
        contributions: 'newsfeed/all',
        hasNext: 'newsfeed/hasNext',
        isLoading: 'newsfeed/isLoading'
      })
    },
    watch: {
      contributions (items) {
        if (items.length) {
          this.ready = true
          app.bricksInstance.update()
        }
      },
      hasNext (hasNext) {
        if (hasNext) {
          try {
            app.$refs.infiniteLoading.stateChanger.reset()
          } catch (err) {}
        }
      },
      isLoading (isLoading) {
        if (isLoading || !app.$refs.infiniteLoading) {
          return
        }
        if (this.hasNext) {
          try {
            app.$refs.infiniteLoading.stateChanger.loaded()
          } catch (err) {}
        } else {
          try {
            app.$refs.infiniteLoading.stateChanger.complete()
          } catch (err) {}
        }
      },
      changeLayout () {
        const app = this
        app.$nextTick(() => {
          app.updateGrid()
        })
      },
      searchQuery (value) {
        console.log('##searchQuery')
        this.$store.commit('newsfeed/setSearch', value)
        this.resetList(this)
      },
      searchCategories () {
        console.log('##searchCategories')
        // this.resetList(this)
      },
      searchEmotions () {
        console.log('##searchEmotions')
        // this.resetList(this)
      }
    },
    methods: {
      saveScrollPos () {
        this.$store.commit('newsfeed/setLastScrollPos', window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
      },
      resetList (app) {
        app.$nextTick(() => {
          app.$store.commit('newsfeed/clear')
          window.scrollTo(0, 0)
          app.onInfinite()
          try {
            app.$refs.infiniteLoading.stateChanger.reset()
          } catch (err) {}
        })
      },
      updateGrid: _.throttle((resize = false, update = false) => {
        // throttle the grid updates for better performance
        if (resize) {
          app.bricksInstance.resize(false).pack()
        } else if (update) {
          try {
            app.bricksInstance.update()
          } catch (err) {
            app.bricksInstance.pack()
          }
        } else {
          app.bricksInstance.pack()
        }
      }, 150),
      onInfinite: _.throttle(($state) => {
        app.$store.dispatch('newsfeed/fetchMore')
      }, 150)
    },
    mounted: function () {
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
      console.log('#length', this.contributions.length)

      if (this.contributions.length) {
        this.$store.commit('newsfeed/setLoading', true)
        const lastScrollPos = this.$store.getters['newsfeed/lastScrollPos']
        window.scrollTo(0, lastScrollPos)
        setTimeout(() => {
          this.$store.commit('newsfeed/setLoading', false)
          this.$store.commit('newsfeed/setHasNext', true)
        }, 1000)
        this.updateGrid(false, true)
      } else {
        this.resetList(this)
        this.$store.dispatch('newsfeed/fetch')
      }
      this.ready = !!this.contributions.length

      window.addEventListener('load', () => {
        this.updateGrid(false, true)
      })
      window.addEventListener('resize', _.throttle((e) => {
        this.updateGrid(true, false)
      }, 200))
    },
    head () {
      return {
        title: this.$t('page.index.title')
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import 'assets/styles/utilities';

    .cards {
        padding:      0;
        margin-left:  auto;
        margin-right: auto;

        @include mobile() {
            width: 100% !important;
        }

        &:empty {
            height: 20vh !important;
        }
    }

    .loader-no-data,
    .loader-spinner,
    .loader-no-more {
        padding-top: 30px;
        display:     inline-block;
        color:       lighten($grey, 10%);

        img {
            display:       inline-block;
            margin-bottom: -0.5rem;
        }
    }

    .loader-spinner {
        width:    100%;
        position: relative;
        height:   80px;
        display:  flex;
    }

    .add-contribution {
        z-index:  60;
        position: fixed;
        bottom:   70px;
        right:    50px;

        @include mobile() {
            bottom: 25px;
            right:  25px;
        }

        .button {
            box-shadow:                 0 20px 60px 0 rgba(0, 0, 0, .35) !important;
            transition:                 box-shadow, transform;
            transition-duration:        100ms;
            transition-timing-function: ease-in-out;

            &:hover {
                transform:  scale(1.1);
                box-shadow: 0 20px 60px 0 rgba(0, 0, 0, .35);
            }
        }
    }
</style>
