<template>
  <div class="hc-frame">
    <div class="hc-navigation">
      <hc-topbar></hc-topbar>
    </div>
    <div class="hc-content">
      <slot></slot>
    </div>
  </div>
</template>


<script>
  import HcTopbar from '~/components/layout/Topbar.vue'

  export default {
    name: 'hc-frame',
    components: {
      HcTopbar
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-navigation {
    position: fixed !important;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 100;
    pointer-events: none;
  }
</style>
