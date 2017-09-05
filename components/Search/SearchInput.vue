<template>
    <div class="search">
        <div class="field">
            <p class="control has-icons-right">
                <input class="input" type="text" placeholder="Suchen ..."
                       v-model="value"
                       v-on:keyup="onInput">
                <span class="icon is-small is-right">
                    <hc-icon icon="search"></hc-icon>
                </span>
            </p>
        </div>
    </div>
</template>

<script>
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
      onInput: _.throttle(() => {
        app.$store.commit('search/query', app.value)
      }, 500)
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
                border-radius: 2em;
                height:        2.5em;
                padding-left:  1em;
                padding-right: 2em;
            }

            .icon {
                height: 2.5em;
            }
        }
    }
</style>
