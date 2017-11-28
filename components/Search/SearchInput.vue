<template>
    <div class="search">
        <div class="field">
            <p class="control has-icons-right">
                <span class="icon is-small is-left">
                    <hc-icon icon="search"></hc-icon>
                </span>
                <input class="input" type="text" placeholder="Suchen ..." v-model="value" v-on:keyup="onInput">
            </p>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import _ from 'lodash'

  let app
  export default {
    name: 'hc-search-input',
    data () {
      app = this
      return {
        value: ''
      }
    },
    methods: {
      onInput: _.debounce(() => {
        app.$store.commit('search/query', app.value)
      }, 300)
    },
    watch: {
      searchQuery (query) {
        this.value = query
      }
    },
    computed: {
      ...mapGetters({
        searchQuery: 'search/query'
      })
    }
  }
</script>

<style scoped lang="scss">
    @import "assets/styles/utilities";

    .search {
        display: flex;

        .field {
            display:     flex;
            align-items: center;
        }

        .control {
            input {
                // border-radius: $radius-large;
                border-radius: 2em;
                height:        2.5em;
                padding-left:  2em;
                padding-right: 1em;
            }

            .icon {
                height: 2.5em;
            }
        }
    }
</style>
