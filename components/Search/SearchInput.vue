<template>
  <div class="search" aria-label="search" role="search" :class="{ 'is-active': isActive }">
    <div class="field">
      <div class="control has-icons-left has-icons-right">
        <label for="nav-search" class="is-hidden">{{ $t('component.search.placeholder') }}</label>
        <input class="input"
               id="nav-search"
               name="search"
               type="text"
               v-bind:placeholder="$t('component.search.placeholder')"
               v-model="value"
               v-on:keyup="onInput"
               ref="input">
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
  import {mapGetters, mapMutations} from 'vuex'
  import {isEmpty} from 'lodash'

  export default {
    name: 'hc-search-input',
    data () {
      return {
        value: '',
        searchProcess: null,
        searching: false
      }
    },
    methods: {
      ...mapMutations({
        search: 'search/query'
      }),
      focus () {
        this.$refs.input.focus()
      },
      onInput () {
        if (this.searching) {
          clearTimeout(this.searchProcess)
        }
        this.searching = true
        this.searchProcess = setTimeout(() => {
          this.searching = false
          this.search(this.value)
        }, 700)
      },
      clear () {
        this.search('')
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
    height: 100%;
    width: 100%;
    position: relative;

    .field {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .control {
      width: 100%;
      input {
        width: 100%;
        border-radius: 2px;
        height: 2.5em;
        padding-left: 2em;
        padding-right: 1em;
        font-size: 1em;
        transition-duration: 0.15s;
        transition-timing-function: ease-out;
        transition-property: border, background-color;

        & {
          border-color: $white-ter;
        }
      }
    }

    input {
      padding-right: 2em !important;
      background-color: $white-ter;
    }

    input:hover {
      background-color: $white-bis;
    }

    input:focus, &.is-active input.input {
      background-color: $white-bis;
    }

    .icon {
      height: 2.5em;
      font-size: 1em;
      transition-duration: 0.15s;
      transition-timing-function: ease-out;
      transition-property: color;

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
