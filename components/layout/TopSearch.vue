<template>
  <div class="hc-top-search">
    <search-input class="is-hidden-mobile"
                  id="nav-search"
                  :value="searchQuery"
                  :style="{ height: '100%' }"
                  @search="onSearch" />
    <hc-dropdown :persist="true"
                 :mobileFixed="true"
                 @open="opened"
                 @hide="closed"
                 class="is-hidden-tablet">
      <hc-navbar-button slot="toggle">
        <hc-icon icon="search"></hc-icon>
      </hc-navbar-button>
      <div class="hc-top-search-mobile-inner">
        <search-input v-if="mobileSearchVisible"
                      id="nav-mobile-search"
                      :value="searchQuery"
                      :style="{ height: '100%' }"
                      @search="onSearch" />
      </div>
    </hc-dropdown>
  </div>
</template>


<script>
  import SearchInput from '../Search/SearchInput.vue'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'hc-top-search',
    components: {
      SearchInput
    },
    data () {
      return {
        mobileSearchVisible: false
      }
    },
    computed: {
      ...mapGetters({
        searchQuery: 'search/query'
      })
    },
    methods: {
      onSearch (value) {
        this.$store.commit('search/query', value)
      },
      opened () {
        // setTimeout(() => {
        this.mobileSearchVisible = true
        // }, 25)
      },
      closed () {
        // setTimeout(() => {
        this.mobileSearchVisible = false
        // }, 100)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-top-search {
    width: 100%;
  }

  .hc-top-search-mobile-inner {
    padding: 2rem 1rem;
  }
</style>
