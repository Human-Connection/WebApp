<template>
  <nav class="sidebar-menu menu">
    <!--<p class="menu-label">
      {{ $t('auth.settings.general', 'General') }}
    </p>-->
    <nuxt-link :to="{ name: 'admin' }" class="menu-item">
      <hc-icon icon="dashboard" class="menu-icon" />
      <span>
        {{ $t('component.dashbord.label', 'Dashboard') }}
      </span>
    </nuxt-link>
    <nuxt-link :to="{ name: 'admin-organizations' }" class="menu-item">
      <hc-icon icon="building" class="menu-icon" />
      <span>
        {{ $t('component.admin.organizations', 'Organizations') }}
      </span>
    </nuxt-link>
    <nuxt-link :to="{ name: 'admin-users' }" class="menu-item">
      <hc-icon icon="user-circle" class="menu-icon" />
      <span>
        {{ $t('component.admin.users', 'Users') }}
      </span>
    </nuxt-link>
    <nuxt-link :to="{ name: 'admin-pages' }" class="menu-item">
      <hc-icon icon="file-text" class="menu-icon" />
      <span>
        {{ $t('component.admin.pages', 'Pages') }}
      </span>
    </nuxt-link>
    <nuxt-link :to="{ name: 'admin-notifications' }" class="menu-item">
      <hc-icon icon="bullhorn" class="menu-icon" />
      <span>
        {{ $t('component.admin.systemNotifications', 'System Notifications') }}
      </span>
    </nuxt-link>
    <nuxt-link :to="{ name: 'admin-categories' }" class="menu-item">
      <hc-icon icon="map-signs" class="menu-icon" />
      <span>
        {{ $t('component.category.labelOnePluralNone', null, 2) }}
      </span>
    </nuxt-link>
    <nuxt-link :to="{ name: 'admin-settings' }" class="menu-item">
      <hc-icon icon="cog" class="menu-icon" />
      <span>
        {{ $t('component.admin.settings', 'Settings') }}
      </span>
    </nuxt-link>
  </nav>
</template>


<script>
  export default {
    name: 'hc-admin-menu'
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  $icon-padding: ($sidebar-closed-width - $sidebar-icon-width)/4 - 3px;

  .sidebar-menu {
    // background-color: $white;
  }

  .menu-item {
    display: flex;
    position: relative;
    padding: 0 $icon-padding;
    margin-bottom: 2px;
    color: $grey-darker;
    align-items: center;
    width: 100%;
    transition: all 0.1s ease-out;
    letter-spacing: 0.05em;
    // word-break: break-all;
    line-height: 1.1em;

    &:hover {
      background-color: $white-ter;
    }

    &.nuxt-link-exact-active {
      background-color: $white;
    }

    span {
      margin-bottom: -2px;
    }
  }

  .menu-icon {
    display: inline-flex;
    margin-right: $icon-padding + 2px;
    width: 38px;
    height: 38px;
    border-radius: 100%;
    color: $grey-dark;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    transition: all 0.1s ease-out;

    // .nuxt-link-exact-active & {
    //   color: $white;
    //   background-color: $primary;
    // }
  }
</style>
