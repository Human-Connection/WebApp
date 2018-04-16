<template>
  <div class="textCount">
    <slot></slot>
    <span>{{ countNumber }}</span>
    {{ text }}
  </div>
</template>

<script>
  import { isArray, isInteger } from 'lodash'

  export default {
    name: 'hc-textcount',
    props: ['count', 'text'],
    data () {
      return {
        countNumber: 0
      }
    },
    watch: {
      count () {
        this.checkCount()
      }
    },
    methods: {
      checkCount () {
        let val = this.count
        if (isArray(val)) {
          this.countNumber = val.length
        } else if (isInteger(this.count)) {
          this.countNumber = parseInt(val)
        } else {
          this.countNumber = 0
        }
      }
    },
    created () {
      this.checkCount()
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .textCount {
    text-transform: uppercase;
    font-size: 10px;
    color: $primary;
    line-height: 19px;
    span {
      font-size: 19px;
      color: $grey;
      display: block;
      // text-align: center;
    }
  }
</style>
