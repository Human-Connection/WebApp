<template>
  <div class="sidebar" :class="classes">
    <div class="desktop-toggle">
      <hc-sidebar-toggle></hc-sidebar-toggle>
    </div>
    <div class="sidebar-content">
      <hc-sidebar-menu></hc-sidebar-menu>
    </div>
  </div>
</template>


<script>
  import {mapGetters, mapActions} from 'vuex'
  import HcSidebarToggle from '~components/layout/SidebarToggle'
  import HcSidebarMenu from '~components/layout/SidebarMenu'

  export default {
    components: {
      HcSidebarToggle,
      HcSidebarMenu
    },
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
    top: $topbar-height;
    bottom: 0;
    left: 0;
    z-index: 120;
    width: auto;
    background-color: $white-bis;
    pointer-events: all;

    @include until($tablet) {
      right: 0;
      transform: translateX(-3%);
      opacity: 0;
      visibility: hidden;
      transition: all $sidebar-animation;

      &.is-open {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .desktop-toggle {
    position: absolute;
    top: 0;
    right: 0;
    display: none;

    @include tablet {
      display: block;
    }

    @include from($sidebar-breakpoint) {
      display: none;
    }
  }

  .sidebar-content {
    width: 100%;
    overflow: hidden;
    transition: width $sidebar-animation;
    padding-top: $sidebar-closed-width;

    .is-open & {
      width: $sidebar-open-width;
    }

    @include tablet {
      width: $sidebar-closed-width;
      top: $topbar-height;
    }

    @include from($sidebar-breakpoint) {
      width: $sidebar-open-width;
    }
  }
</style>
