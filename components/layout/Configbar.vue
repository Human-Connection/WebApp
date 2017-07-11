<template>
  <div class="config-bar">
    <div class="container">
      <nav class="config-menu">
        <div class="config-item">
          <span class="config-icon">
            <hc-icon icon="sliders"></hc-icon>
          </span>
          Filtern
        </div>
        <div class="config-item">
          <span class="config-icon">
            <hc-icon icon="sort-amount-asc"></hc-icon>
          </span>
          Sortieren
        </div>
        <div class="config-item">
          <span class="config-icon">
            <hc-icon icon="tasks"></hc-icon>
          </span>
          Ansicht
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
    background-color: $grey-lighter;
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
    color: $grey-dark;
    font-size: $size-small;
    height: 100%;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    transition: all 0.1s ease-out;

    &:hover {
      color: $grey-darker;
    }
  }

  .config-icon {
    display: inline-flex;
    height: 30px;
    width: 30px;
    margin-right: 5px;
    font-size: 1.2em;
    border-radius: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
