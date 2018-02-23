<template>
  <hc-dropdown :persist="true"
    position="bottom-justify"
    :boundaryAlign="true"
    :boundary="$parent.$refs['navbar-container']">
    <hc-navbar-button slot="toggle">
      <hc-icon icon="filter"></hc-icon>
    </hc-navbar-button>
    <div class="hc-filter-select">
      <div class="container is-fluid has-text-left">
        <div class="columns">
          <div class="column">
            <no-ssr>
              <hc-tooltip
                :label="$t('component.layout.topbarFilterDescription')"
                position="is-right"
                size="is-large"
                multilined>
                <h6 class="title is-6">
                  {{ $t('component.category.labelLongOnePluralNone', 'Categories', null, categories.length) }}
                  <hc-icon set="fa" icon="question-circle"/>
                </h6>
              </hc-tooltip>
            </no-ssr>
            <filter-list
              @change="filterForCategories"
              :items="categories"
              translationPath="component.category.slug2label-"
              :selected="selectedCategoryIds"/>
            <hr/>
            <h6 class="title is-6">{{ $t('component.layout.topbarSectionEmotions', 'Emotions') }}</h6>
            <filter-list
              @change="filterForEmotions"
              :items="emotions"
              :selected="selectedEmotions"
              iconSet="hc-emoji"/>
            <br/>
          </div>
        </div>
      </div>
    </div>
  </hc-dropdown>
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
  @import "~bulma/sass/components/navbar";

  .hc-filter-select {
    padding-top: 1rem;
    padding-bottom: 1rem;
    max-height: 100vh;
    overflow: auto;
    user-select: none;

    h6 {
      margin: 1rem 0;
    }

    .tooltip {
      font-size: 0.9rem;
    }

    .uk-open & {
      overflow: visible;
    }
  }
</style>
