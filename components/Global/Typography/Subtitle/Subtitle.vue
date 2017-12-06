<template>
  <div class="hc-subtitle">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'hc-subtitle'
  }
</script>

<style lang="scss">
  .hc-subtitle {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
    text-align: center;
    font-weight: bold;
  }
</style>
