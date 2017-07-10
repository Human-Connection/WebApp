<template>
  <div class="config-bar">
    <div class="container">
      Configbar
    </div>
  </div>
</template>


<script>
  export default {
    name: 'hc-configbar'
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";

  .config-bar {
    position: relative;
    z-index: 100;
    pointer-events: all;
    padding: 0 0.6em;
    height: $configbar-height;
    background-color: $grey-lighter;
    padding-left: 0;

    @include tablet() {
      padding-left: $sidebar-closed-width;
    }

    @include from($sidebar-breakpoint) {
      padding-left: $sidebar-open-width;
    }
  }
</style>
