<template>
  <div class="hc-dropdown">
    <select class="hc-select">
      <option v-for="text in showLabels">{{ text }}</option>
    </select>
    <select class="hc-select">
      <option v-for="text in sortLabels">{{ text }}</option>
    </select>
  </div>
</template>

<script>
  export default {
    name: 'hc-dropdown',
    props: ['showLabels', 'sortLabels']
  }
</script>

<style lang="scss">
  .hc-dropdown {
    display: flex;
    justify-content: flex-start;
    .hc-select {
      background: white;
      border: 0;
      font-size: 12px;
    }
  }
</style>
