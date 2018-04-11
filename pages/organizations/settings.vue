<template>
  <section class="container organization-settings" style="position: relative">
    <h2 class="title is-2">{{ $t('component.organization.general', 'Organization settings') }}</h2>
    <div class="columns">
      <div class="column is-one-third menu">
        <aside class="menu">
          <p class="menu-label">
            {{ $t('component.organization.generalDetails', 'General details') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="$router.push({ name: 'organizations-settings' })"
                :class="{ 'is-active': $route.name === 'organizations-settings'}">
              <a>{{ $t('component.organization.generalData', 'Organizationdata') }}</a>
            </li>
          </ul>
          <ul class="menu-list">
            <li @click.prevent="$router.push({ name: 'organizations-settings-projects' })"
                :class="{ 'is-active': $route.name === 'organizations-settings-projects'}">
              <a>{{ $t('component.organization.projects', 'Projects') }}</a>
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
  .organization-settings {
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
