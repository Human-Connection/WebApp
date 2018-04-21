<template>
  <hc-box class="counts">
    <nav class="level is-mobile">
      <div class="level-item has-text-centered"
           v-for="item in items"
           :key="item.key"
           @click="clickHandler(item)"
           :class="{ 'is-active': currentKey === item.key }">
        <div>
          <p class="title"><count-to :startVal="0" :endVal="item.count" :duration="1000" :autoplay="true" separator="." /></p>
          <p class="heading">{{ item.label }}</p>
        </div>
      </div>
    </nav>
  </hc-box>
</template>

<script>
  import countTo from 'vue-count-to'
  import { findIndex } from 'lodash'

  export default {
    name: 'hc-profile-nav',
    props: {
      items: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    components: {
      'count-to': countTo
    },
    data () {
      return {
        currentKey: null
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.items.length && !this.currentKey) {
          this.clickHandler(this.items[0])
        }
      })
    },
    methods: {
      clickHandler (item) {
        if (!this.currentKey || this.currentKey !== item.key) {
          this.currentKey = item.key

          this.$emit('changed', item, findIndex(this.items, ['key', item.key]))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .level {
    padding: 0;
    user-select: none;
  }

  .level-item {
    cursor: pointer;
    padding: 1em;
    border-bottom: 3px solid transparent;
    opacity: .7;
    transition: 150ms;

    &.is-active {
      border-bottom-color: $primary;
      opacity: 1;
    }
    &:hover {
      border-bottom-color: lighten($primary, 10%);
      opacity: 1;
    }
    &:last-child {
      margin-right: 0;
    }
  }

  .heading {
    font-weight: bold;
    margin-bottom: 0.3em !important;
  }
  .title {
    font-size: 1.3em !important;
    margin-bottom: 0.3em !important;
  }
</style>

