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
  @import "assets/styles/utilities";

  .count {
    $batchSize: 18px;

    position: absolute;
    top: -$batchSize / 2;
    left: 100%;
    font-weight: bold;
    margin-left: -$batchSize / 2;
    background-color: $primary;
    color: $white;
    min-width: $batchSize;
    height: $batchSize;
    padding: 0 4px;
    text-align: center;
    font-size: .7rem;
    line-height: $batchSize - 2;
    border-radius: $batchSize / 2;
    border: 1px solid $white;
    pointer-events: none;
    user-select: none;
    z-index: 1;
  }
</style>
