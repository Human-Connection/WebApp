<template>
  <div class="hc-top-search">
    <search-input class="is-hidden-mobile"></search-input>
    <hc-dropdown :persist="true"
                 :mobileFixed="true"
                 @open="opened"
                 @hide="closed"
                 class="is-hidden-tablet">
      <hc-navbar-button slot="toggle">
        <hc-icon icon="search"></hc-icon>
      </hc-navbar-button>
      <div class="hc-top-search-mobile-inner">
        <search-input :focus="true" v-if="mobileSearchVisible" ref="searchInput"></search-input>
      </div>
    </hc-dropdown>
  </div>
</template>


<script>
  import SearchInput from '../Search/SearchInput.vue'

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
    methods: {
      opened () {
        setTimeout(() => {
          this.mobileSearchVisible = true
        }, 25)
      },
      closed () {
        setTimeout(() => {
          this.mobileSearchVisible = false
        }, 100)
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
