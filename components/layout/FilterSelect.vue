<template>
  <div>
    <hc-dropdown class="is-hidden-mobile"
      :persist="true"
      position="bottom-justify"
      ref="dropdown"
      :mobileFull="true"
      :boundaryAlign="true"
      :boundary="$parent.$refs['navbar-container']">
      <hc-navbar-button slot="toggle"
                        :class="{'active': !!$store.getters['search/query']}">
        <span class="is-hidden">
          {{ $t('component.filter.label') }}
        </span>
        <hc-icon icon="filter"></hc-icon>
      </hc-navbar-button>
      <div class="hc-filter-select">
        <div class="hc-filter-select-inner">
          <no-ssr>
            <hc-tooltip
              :label="$t('component.layout.topbarFilterDescription')"
              position="is-right"
              size="is-large"
              multilined>
              <strong class="title is-6">
                {{ $t('component.category.labelLongOnePluralNone', 'Categories', null, categories.length) }}
                <hc-icon set="fa" icon="question-circle"/>
              </strong>
            </hc-tooltip>
          </no-ssr>
          <filter-list
            @change="filterForCategories"
            :items="categories"
            translationPath="component.category.slug2label-"
            :selected="selectedCategoryIds"/>
          <hr/>
          <strong class="title is-6">{{ $t('component.layout.topbarSectionEmotions', 'Emotions') }}</strong>
          <filter-list
            @change="filterForEmotions"
            :items="emotions"
            :selected="selectedEmotions"
            iconSet="hc-emoji"/>
        </div>
      </div>
    </hc-dropdown>
    <hc-dropdown class="is-hidden-tablet"
      :persist="true"
      position="bottom-justify"
      ref="dropdown"
      :mobileFull="true"
      :boundaryAlign="true"
      :boundary="$parent.$refs['navbar-container']">
      <hc-navbar-button slot="toggle"
                        :class="{'active': !!$store.getters['search/query']}">
        <hc-icon icon="filter"></hc-icon>
      </hc-navbar-button>
      <div class="hc-filter-select">
        <div class="hc-filter-select-inner">
          <no-ssr>
            <b-tabs class="fullwidth">
              <b-tab-item :label="$t('component.category.labelLongOnePluralNone', 'Categories', null, categories.length)" id="categories">
                <filter-list
                  @change="filterForCategories"
                  :items="categories"
                  translationPath="component.category.slug2label-"
                  :selected="selectedCategoryIds"/>
              </b-tab-item>
              <b-tab-item :label="$t('component.layout.topbarSectionEmotions', 'Emotions')" id="emotions">
                <filter-list
                  @change="filterForEmotions"
                  :items="emotions"
                  :selected="selectedEmotions"
                  iconSet="hc-emoji"/>
              </b-tab-item>
            </b-tabs>
          </no-ssr>
        </div>
      </div>
      <div slot="footer">
        <hc-button @click="$refs.dropdown.close()"
          size="medium"
          :fullWidth="true">
          <hc-icon class="icon-left" icon="check" />
          {{ $t('component.category.setFilter', 'Set filter') }}
        </hc-button>
      </div>
    </hc-dropdown>
  </div>
</template>


<script>
  import {mapGetters} from 'vuex'
  import FilterList from '~/components/Filters/FilterList.vue'

  import {isEqual, map} from 'lodash'

  export default {
    name: 'hc-filter-select',
    components: {
      FilterList
    },
    data () {
      return {
        selectedCategoryIds: [],
        selectedEmotions: [],
        filterThrottle: null,
        filterEmotionThrottle: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user',
        categories: 'categories/all'
      }),
      emotions () {
        return [
          {
            _id: 'funny',
            title: this.$t('component.emotionRating.funny'),
            icon: 'funny'
          },
          {
            _id: 'happy',
            title: this.$t('component.emotionRating.happy'),
            icon: 'happy'
          },
          {
            _id: 'surprised',
            title: this.$t('component.emotionRating.surprised'),
            icon: 'surprised'
          },
          {
            _id: 'cry',
            title: this.$t('component.emotionRating.cry'),
            icon: 'cry'
          },
          {
            _id: 'angry',
            title: this.$t('component.emotionRating.angry'),
            icon: 'angry'
          }
        ]
      }
    },
    watch: {
      categories (categories) {
        this.applyCategoryFilter(map(categories, '_id'))
      }
    },
    mounted () {
      this.$store.dispatch('categories/init')

      // TODO: aplly filters from user config or local storage, but keep them between sessions
      this.applyCategoryFilter(map(this.categories, '_id'))
      this.applyEmotionFilter(map(this.emotions, '_id'))
    },
    methods: {
      filterForCategories (ids) {
        clearTimeout(this.filterThrottle)
        if (!isEqual(ids, this.selectedCategoryIds)) {
          this.filterThrottle = setTimeout(() => {
            this.applyCategoryFilter(ids)
          }, 1000)
        }
      },
      applyCategoryFilter (ids) {
        clearTimeout(this.filterThrottle)
        if (!isEqual(ids, this.selectedCategoryIds)) {
          this.selectedCategoryIds = ids
          this.$store.commit('search/categoryIds', ids)
        }
      },
      filterForEmotions (emotions) {
        clearTimeout(this.filterEmotionThrottle)
        if (!isEqual(emotions, this.selectedEmotions)) {
          this.filterEmotionThrottle = setTimeout(() => {
            this.applyEmotionFilter(emotions)
          }, 1000)
        }
      },
      applyEmotionFilter (emotions) {
        clearTimeout(this.filterEmotionThrottle)
        if (!isEqual(emotions, this.selectedEmotions)) {
          // get deselected emotions
          this.selectedEmotions = emotions
          this.$store.commit('search/emotions', this.selectedEmotions)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-filter-select {
    user-select: none;

    .is-6.title {
      margin: 1rem 0;
    }

    .tooltip {
      font-size: 0.9rem;
    }

    .uk-open & {
      overflow: visible;

      @include until($tablet) {
        overflow: hidden;
      }
    }
  }

  .hc-filter-select-inner {
    padding: 1rem;
  }
</style>
