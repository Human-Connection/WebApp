<template>
  <div class="hc-mention-search-box">
    <div class="hc-results">
      <div class="hc-mention-search-spinner" v-if="searchString && loading">
        <hc-spinner :height="16" />
      </div>
      <search-list :list="list"
        @itemselected="(value) => { $emit('itemselected', value) }" />
    </div>
    <div class="hc-mention-no-results" v-if="nothingFound">
      {{ $t('component.search.noResults') }}
    </div>
  </div>
</template>

<script>
  import SearchList from '~/components/Search/List.vue'
  import feathers from '~/plugins/feathers'

  export default {
    name: 'hc-editor-mentions-search',
    components: {
      SearchList
    },
    data () {
      return {
        loading: false,
        list: [],
        searchTimeout: false,
        activeSearches: 0,
        cancel: false
      }
    },
    props: {
      searchString: {
        type: String,
        default: ''
      }
    },
    computed: {
      nothingFound () {
        if (this.loading || !this.searchString || !this.list || !this.list.length) {
          return false
        }
        return this.list.every(group => {
          return !group.items || !group.items.length
        })
      }
    },
    methods: {
      search (searchString) {
        this.activeSearches++
        this.cancel = false
        if (!searchString.length) {
          this.endSearch([])
          this.cancel = true
          return
        }
        let query = {
          $search: searchString,
          $ressources: [
            'users'
          ]
        }
        feathers.service('search')
          .find({query})
          .then(result => {
            this.endSearch(result.data)
          })
          .catch(error => {
            console.log(error)
            this.endSearch([])
          })
      },
      endSearch (data) {
        this.activeSearches--
        if (!this.activeSearches) {
          this.loading = false
        }
        // Only set list if search was not cancelled before
        if (!this.cancel) {
          this.list = data || []
        }
      }
    },
    watch: {
      searchString (searchString) {
        this.loading = true
        // Only call search, after user has finished typing
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.search(searchString)
        }, 200)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-mention-search-box {
    position: relative;
    width: 300px;
    background-color: $white;
    box-shadow: $card-shadow-hover;
    border: 1px solid $border;
    min-height: 40px;
  }

  .hc-mention-search-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    color: $primary;
  }
</style>
