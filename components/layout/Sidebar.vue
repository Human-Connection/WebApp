<template>
  <div class="sidebar" :class="classes">
    <span @click="toggleSidebar" class="sidebar-toggle">
      <span class="toggle-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </span>
    <div class="sidebar-content">
    </div>
  </div>
</template>


<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'hc-sidebar',
    computed: {
      ...mapGetters({
        sidebar: 'layout/sidebar'
      }),
      classes () {
        let classes = ''
        if (this.sidebar.open) {
          classes += 'is-open'
        }
        return classes
      }
    },
    methods: {
      ...mapActions({
        toggleSidebar: 'layout/toggleSidebar'
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";

  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
    width: auto;
    background-color: $white;
    box-shadow: 2px 0 3px rgba(10, 10, 10, 0.1);
    pointer-events: all;
  }

  .sidebar-toggle {
    position: absolute;
    top: 0;
    right: 0;
    width: $sidebar-closed-width;
    height: $sidebar-closed-width;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      .toggle-icon span {
        background-color: $grey-dark;
      }
    }
  }

  .toggle-icon {
    width: 24px;
    display: block;
    span {
      width: 100%;
      display: block;
      height: 3px;
      border-radius: 4px;
      background-color: $grey;
      transition: all 0.2s ease-out;
      margin-bottom: 3px;
    }
  }

  .sidebar-content {
    width: $sidebar-closed-width;
    overflow: hidden;
    transition: width $sidebar-animation;

    .is-open & {
      width: $sidebar-open-width;
    }
  }
</style>
