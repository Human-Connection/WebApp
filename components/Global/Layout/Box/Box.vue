<template>
  <div :class="classes">
    <slot></slot>
    <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
  </div>
</template>

<script>
  export default {
    name: 'hc-box',
    props: ['top', 'bottom', 'isLoading'],
    data () {
      return {
        loading: false
      }
    },
    watch: {
      isLoading (loading) {
        this.loading = loading === true
      }
    },
    mounted () {
      this.loading = this.isLoading === true
    },
    computed: {
      classes () {
        let classes = 'card is-box'
        if (this.top) {
          classes += ' has-margin-top'
        }
        if (this.bottom) {
          classes += ' has-margin-bottom'
        }
        return classes
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .card {
    border: none;
    box-shadow: 0px 5px 13px -4px rgba(0, 0, 0, .1);
  }

  .is-box {
    background-color: $white;
    padding: 15px;
  }
</style>
