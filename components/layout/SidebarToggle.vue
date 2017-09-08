<template>
  <span @click="toggleSidebar" class="sidebar-toggle">
    <span class="toggle-icon">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </span>
</template>


<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'hc-sidebar-toggle',
    methods: {
      ...mapActions({
        toggleSidebar: 'layout/toggleSidebar'
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .sidebar-toggle {
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
      height: 2px;
      border-radius: 4px;
      background-color: $grey;
      transition: all 0.2s ease-out;
      margin-bottom: 4px;
    }
  }
</style>
