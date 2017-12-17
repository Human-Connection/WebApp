<template>
    <div class="search" :class="{ 'is-active': isActive }">
        <div class="field">
            <p class="control has-icons-right">
                <span class="icon is-small is-left">
                    <hc-icon icon="search"></hc-icon>
                </span>
                <input class="input"
                       type="text"
                       v-bind:placeholder="$t('component.search.placeholder')"
                       v-model="value"
                       v-on:keyup="onInput">
            </p>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
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
      }, 600)
    },
    watch: {
      searchQuery (query) {
        this.value = query
      }
    },
    computed: {
      ...mapGetters({
        searchQuery: 'search/query'
      }),
      isActive () {
        return !_.isEmpty(this.value)
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "assets/styles/utilities";

    .search {
        display: flex;
        height:  100%;

        .field {
            display:     flex;
            align-items: center;
        }

        .control {
            input {
                // border-radius: $radius-large;
                border-radius: 2px;
                height:        2.5em;
                padding-left:  2em;
                padding-right: 1em;
                font-size:     1em;

                &, &:hover {
                    border-color: transparent;
                }
            }
        }

        input:hover {
            background-color: #f9f9f9;
        }

        input:focus, &.is-active input.input {
            background-color: #f5f5f5;
        }

        .icon {
            height: 2.5em;
            font-size: 1em;
        }

        &.is-active .icon {
            color: $grey-light;
        }
    }
</style>
