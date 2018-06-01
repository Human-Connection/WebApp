<template>
  <div class="search" aria-label="search" role="search" :class="{ 'is-active': isActive }">
    <div class="field">
      <div class="control has-icons-left has-icons-right">
        <label :for="id" class="is-hidden">{{ $t('component.search.placeholder') }}</label>
        <input class="input"
               v-focus="focus"
               :id="id"
               name="search"
               type="text"
               :placeholder="$t('component.search.placeholder')"
               v-model="searchValue"
               @keyup="onInput"
               @keyup.enter="onEnter"
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
  // import {mapGetters, mapMutations} from 'vuex'
  import {isEmpty} from 'lodash'

  export default {
    name: 'hc-search-input',
    props: {
      id: {
        type: String,
        default: 'nav-search'
      },
      value: {
        type: String,
        default: ''
      },
      delay: {
        type: Number,
        default: 700
      },
      focus: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        searchValue: '',
        searchProcess: null,
        searching: false
      }
    },
    mounted () {
      this.updateValue()
    },
    methods: {
      updateValue () {
        console.log('updateValue', this.value)
        if (!this.value) {
          this.searchValue = ''
        } else if (this.value.toString() !== this.searchValue.toString()) {
          this.searchValue = this.value.toString()
        }
      },
      onInput () {
        clearTimeout(this.searchProcess)
        this.searching = true
        if (this.searchValue && this.searchValue.toString().length < 3) {
          return
        }
        this.searchProcess = setTimeout(() => {
          this.searching = false
          this.$emit('search', this.searchValue.toString())
        }, this.delay)
      },
      onEnter () {
        clearTimeout(this.searchProcess)
        this.$nextTick(() => {
          clearTimeout(this.searchProcess)
        })
        this.searching = false
        this.$emit('search', this.searchValue.toString())
      },
      clear () {
        this.searching = false
        this.$emit('search', '')
      }
    },
    watch: {
      value (value) {
        this.$nextTick(() => {
          this.updateValue()
        })
      }
    },
    computed: {
      isActive () {
        return !isEmpty(this.searchValue)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .search {
    display: flex;
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
