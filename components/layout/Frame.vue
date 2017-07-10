<template>
  <div class="hc-frame" :class="classes">
    <div class="hc-navigation">
      <hc-topbar></hc-topbar>
      <hc-configbar></hc-configbar>
      <hc-sidebar></hc-sidebar>
      <div class="hc-overlay" @click="closeSidebar"></div>
    </div>
    <div class="hc-content">
      <slot></slot>
    </div>
  </div>
</template>


<script>
  // Todo: overlay as global component

  import {mapGetters, mapActions} from 'vuex'
  import HcSidebar from '~components/layout/Sidebar.vue'
  import HcTopbar from '~components/layout/Topbar.vue'
  import HcConfigbar from '~components/layout/Configbar.vue'

  export default {
    name: 'hc-frame',
    components: {
      HcSidebar,
      HcTopbar,
      HcConfigbar
    },
    computed: {
      ...mapGetters({
        sidebar: 'layout/sidebar'
      }),
      classes () {
        let classes = ''
        if (this.sidebar.open) {
          classes += 'sidebar-open'
        }
        return classes
      }
    },
    methods: {
      ...mapActions({
        closeSidebar: 'layout/closeSidebar'
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";

  .hc-navigation {
    position: fixed !important;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 100;
    pointer-events: none;
  }

  .hc-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($white, 0.4);
    box-shadow: inset 0 0 400px rgba($white, 0.8);
    pointer-events: all;
    z-index: 110;
    opacity: 0;
    visibility: hidden;

    transition: opacity $sidebar-animation, visibility $sidebar-animation;

    .sidebar-open & {
      opacity: 1;
      visibility: visible;

      @include from($sidebar-breakpoint) {
        opacity: 0;
        visibility: hidden;
      }
    }
  }

  .hc-content {
    @include tablet() {
      padding-left: $sidebar-closed-width;
    }

    @include from($sidebar-breakpoint) {
      padding-left: $sidebar-open-width;
    }
  }
</style>
