<template>
  <section class="container account-settings" style="position: relative">
    <h2 class="title is-2">Einstellungen</h2>
    <div class="columns">
      <div class="column is-one-third menu">
        <aside class="menu">
          <p class="menu-label">
            {{ $t('auth.settings.general', 'General') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="$router.push({ name: 'auth-settings' })"
                :class="{ 'is-active': $route.name === 'auth-settings'}">
              <a>{{ $t('auth.settings.data', 'Your Data') }}</a>
            </li>
          </ul>
          <p class="menu-label">
            {{ $t('auth.settings.security', 'Security') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="$router.push({ name: 'auth-settings-access' })"
                :class="{ 'is-active': $route.name === 'auth-settings-access'}">
              <a>{{ $t('auth.settings.access', 'Access') }}</a>
            </li>
          </ul>
          <p class="menu-label">
            {{ $t('auth.settings.organizations', 'Organizations') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="$router.push({ name: 'auth-settings-organizations' })"
                :class="{ 'is-active': $route.name === 'auth-settings-organizations'}">
              <a>{{ $t('auth.settings.myOrganizations', 'My Organizations') }}</a>
            </li>
          </ul>
          <p class="menu-label">
            {{ $t('auth.settings.networkSettings', 'Network settings') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="$router.push({ name: 'auth-settings-languages' })"
                :class="{ 'is-active': $route.name === 'auth-settings-languages'}">
              <a>{{ $t('auth.settings.languages', 'Languages') }}</a>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <hc-box class="settings-content settingswrapper">
          <nuxt-child/>
        </hc-box>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    head () {
      return {
        title: this.$t('auth.account.settings', 'Settings')
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";
  .account-settings {
    .is-active {
      background: #fefefe;
    }
    .info-text {
      margin-bottom: 25px;
    }
    .editable-details {
      margin-bottom: 25px;
    }
    .control {
      .help.counter {
        float: none;
      }
    }
    .language-wrapper {
      .icon {
        margin-top: 21px;
      }
    }

    .menu {
      @media (min-width: $tablet) {
        max-width: 240px;
      }
    }

    .card {
      $padding: 1.5rem;

      padding: $padding !important;

      footer.card-footer {
        margin: -$padding;
        margin-top: 2rem;
        background: lighten($grey-lighter, 10%);
        padding: 1rem $padding;
        display: flex;
        justify-content: right;
      }
    }
  }

  .settings-content {
    overflow-x: hidden;
  }
</style>
