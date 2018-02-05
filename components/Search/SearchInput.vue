<template>
    <div class="search" :class="{ 'is-active': isActive }">
        <div class="field">
            <div class="control has-icons-left has-icons-right">
                <input class="input"
                       type="text"
                       name="search"
                       v-bind:placeholder="$t('component.search.placeholder')"
                       v-model="value"
                       v-on:keyup="onInput">
                <span class="icon is-small is-left">
                    <hc-icon icon="search"></hc-icon>
                </span>
            </div>
            <div v-if="isActive" class="icon is-small is-right btn-clear" @click="clear">
                <hc-icon icon="times-circle"></hc-icon>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { isEmpty, debounce } from 'lodash'

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
      onInput: debounce(() => {
        app.$store.commit('search/query', app.value)
      }, 600),
      clear () {
        app.$store.commit('search/query', '')
      }
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
        return !isEmpty(this.value)
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "assets/styles/utilities";

    .search {
        display: flex;
        height:  100%;
        position: relative;

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

        input {
            padding-right: 2em !important;
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

            &.btn-clear {
                position: absolute;
                right: 0.25rem;
                cursor: pointer !important;
                z-index: 10;
                padding-left: 1em;
                padding-right: 1em;
            }
        }

        &.is-active .icon {
            color: $grey-light;
        }
    }
</style>
