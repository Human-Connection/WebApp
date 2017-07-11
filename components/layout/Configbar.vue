<template>
  <div class="config-bar">
    <div class="container">
      <nav class="config-menu">
        <div class="config-item">
          <hc-icon icon="sliders"></hc-icon>
        </div>
        <div class="config-item">
          <hc-icon icon="sort-amount-asc"></hc-icon>
        </div>
        <div class="config-item">
          <hc-icon icon="tasks"></hc-icon>
        </div>
      </nav>
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
    background-color: $white-dar;
    padding-left: 0;

    @include tablet() {
      padding-left: $sidebar-closed-width;
    }

    @include from($sidebar-breakpoint) {
      padding-left: $sidebar-open-width;
    }
  }

  .config-menu {
    display: flex;
    height: $configbar-height;
    justify-content: space-around;
    align-items: center;
  }

  .config-item {
    display: inline-flex;
    height: 50px;
    width: 50px;
    font-size: 1.2em;
    border: 1px solid $grey-lighter;
    color: $grey;
    cursor: pointer;
    border-radius: 100%;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-out;

    &:hover {
      color: $grey-darker;
    }
  }
</style>
