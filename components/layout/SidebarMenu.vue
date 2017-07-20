<template>
  <nav class="sidebar-menu">
    <nuxt-link to="/" class="menu-item">
      <span class="menu-icon">
        <hc-icon icon="th"></hc-icon>
      </span>
      Dashboard
    </nuxt-link>
    <nuxt-link to="profile" class="menu-item">
      <span class="menu-icon">
        <hc-icon icon="cog"></hc-icon>
      </span>
      Einstellungen
    </nuxt-link>
    <nuxt-link to="messages" class="menu-item">
      <span class="menu-icon">
        <hc-icon icon="comments"></hc-icon>
      </span>
      Nachrichten
    </nuxt-link>
    <nuxt-link to="map" class="menu-item">
      <span class="menu-icon">
        <hc-icon icon="globe"></hc-icon>
      </span>
      Karte
    </nuxt-link>
    <nuxt-link to="calender" class="menu-item">
      <span class="menu-icon">
        <hc-icon icon="calendar-o"></hc-icon>
      </span>
      Kalender
    </nuxt-link>
    <nuxt-link to="help" class="menu-item">
      <span class="menu-icon">
        <hc-icon icon="question"></hc-icon>
      </span>
      Hilfe
    </nuxt-link>
  </nav>
</template>


<script>
  export default {
    name: 'hc-sidebar-menu'
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";

  $icon-padding: ($sidebar-closed-width - $sidebar-icon-width)/2;

  .menu-item {
    display: flex;
    position: relative;
    padding: 10px $icon-padding;
    margin-bottom: 5px;
    color: $grey-darker;
    align-items: center;
    width: $sidebar-open-width;
    transition: all 0.1s ease-out;
    letter-spacing: 0.05em;

    &:hover {
      background-color: $white-ter;
    }

    &.nuxt-link-exact-active {
      background-color: $white-ter;
    }
  }

  .menu-icon {
    display: inline-flex;
    margin-right: $icon-padding + 2px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    color: $grey-dark;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    transition: all 0.1s ease-out;

    .nuxt-link-exact-active & {
      color: $white;
      background-color: $primary;
    }
  }
</style>
