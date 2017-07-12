<template>
  <span class="count" v-if="Number(count) > 0">
    {{ Number(count) }}
  </span>
</template>

<script>
  export default {
    name: 'hc-count-label',
    props: {
      /**
       * Set the count to show
       */
      count: {
        type: [String, Number]
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";

  .count {
    position: absolute;
    top: -7px;
    left: 100%;
    margin-left: -9px;
    background-color: $primary;
    color: $white;
    min-width: 20px;
    height: 20px;
    padding: 0 2px;
    text-align: center;
    font-size: $size-7;
    line-height: 20px;
    border-radius: 50%;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
    pointer-events: none;
    user-select: none;
  }
</style>
