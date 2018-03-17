<template>
    <section class="container" style="position: relative">
        <section class="cards" v-cloak="ready">
            <card v-for="contribution in contributions"
                  :post="contribution"
                  :key="contribution._id"
                  class="card"
                  @ready="updateGrid">
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
  import { throttle } from 'lodash'

  const ContributionCard = () => import('~/components/Contributions/ContributionCard.vue')

  let app
  export default {
    components: {
      'card': ContributionCard,
      'infinite-loading': InfiniteLoading
    },
    transition: null,
    async asyncData ({store}) {
      await store.dispatch('newsfeed/fetch')
    },
    data () {
      return {
        bricksInstance: null,
        errors: null,
        ready: false,
        activated: false
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
      contributions: {
        handler (items) {
          if (items.length) {
            this.ready = true
            this.$nextTick(() => {
              console.log('update grid on contributions watch')
              this.updateGrid(true, true)
            })
          }
        },
        deep: true
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
          console.log('update grid on change layout')
          app.updateGrid()
        })
      },
      searchQuery (value) {
        this.$store.commit('newsfeed/setSearch', value)
        this.resetList(this)
      },
      searchCategories (value) {
        this.$store.commit('newsfeed/setFilter', {
          categoryIds: this.searchCategories,
          emotions: this.searchEmotions
        })
        this.resetList(this)
      },
      searchEmotions (value) {
        this.$store.commit('newsfeed/setFilter', {
          categoryIds: this.searchCategories,
          emotions: this.searchEmotions
        })
        this.resetList(this)
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
      updateGrid: throttle((resize = false, update = false) => {
        if (!app.activated) {
          return
        }
        console.log('start update grid')
        console.log(app.bricksInstance)
        // throttle the grid updates for better performance
        if (resize) {
          console.log('resize brick')
          app.bricksInstance.resize(false).pack()
        } else if (update) {
          console.log('update brick')
          try {
            app.bricksInstance.update()
          } catch (err) {
            console.log('error updating brick', err)
            app.bricksInstance.pack()
          }
        } else {
          console.log('pack brick')
          app.bricksInstance.pack()
        }
      }, 150),
      onInfinite: throttle(($state) => {
        app.$store.dispatch('newsfeed/fetchMore')
      }, 150)
    },
    mounted: function () {
      this.activated = true
      app = this
      app.bricksInstance = new Bricks({
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
      if (this.contributions.length) {
        this.$store.commit('newsfeed/setLoading', true)
        const lastScrollPos = this.$store.getters['newsfeed/lastScrollPos']
        window.scrollTo(0, lastScrollPos)
        setTimeout(() => {
          this.$store.commit('newsfeed/setLoading', false)
          this.$store.commit('newsfeed/setHasNext', true)
        }, 1000)
        console.log('update grid on mounted')
        this.updateGrid(false, true)
      } else {
        this.resetList(this)
        this.$store.dispatch('newsfeed/fetch')
      }
      this.ready = !!this.contributions.length

      window.addEventListener('load', () => {
        console.log('update grid on mounted load')
        this.updateGrid(false, true)
      })
      window.addEventListener('resize', throttle((e) => {
        console.log('update grid on mounted resize')
        this.updateGrid(true, false)
      }, 200))
    },
    activated () {
      console.log('activated')
      this.activated = true
      app = this
      app.bricksInstance = new Bricks({
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
      this.$nextTick(() => {
        console.log('update grid on activated')
        this.updateGrid(false, true)
      })
    },
    deactivated () {
      this.activated = false
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
