<template>
  <section class="container account-settings">
    <h2 class="title is-2 is-marginless">{{ $t('auth.account.settings') }}</h2>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link :to="{ name: 'auth-settings' }">{{ $t('auth.account.settings') }}</nuxt-link>
        </li>
        <li class="is-active">
          <a href="#" aria-current="page">{{ $t(($route.name === 'auth-settings') ? 'auth.settings.data' : $route.name.replace(/-/g, '.')) }}</a>
        </li>
      </ul>
    </nav>
    <div class="columns">
      <div class="column is-one-third menu">
        <aside>
          <p class="menu-label">
            {{ $t('auth.settings.general', 'General') }}
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link :to="{ name: 'auth-settings' }">{{ $t('auth.settings.data', 'Your Data') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'auth-settings-security' }">{{ $t('auth.settings.security', 'Security') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'auth-settings-blacklist' }">{{ $t('auth.settings.blacklist', 'Blacklist') }}</nuxt-link>
            </li>
            <li v-if="showInvites">
              <nuxt-link :to="{ name: 'auth-settings-invites' }">{{ $t('auth.settings.invites', 'Invites') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'auth-settings-download' }">{{ $t('auth.settings.download', 'Download Data') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'auth-settings-delete' }">{{ $t('auth.settings.delete', 'Delete Account') }}</nuxt-link>
            </li>
          </ul>
          <p class="menu-label">
            {{ $t('auth.settings.organizations', 'Organizations') }}
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link :to="{ name: 'auth-settings-organizations' }">{{ $t('auth.settings.myOrganizations', 'My Organizations') }}</nuxt-link>
            </li>
          </ul>
          <p class="menu-label">
            {{ $t('auth.settings.networkSettings', 'Network settings') }}
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link :to="{ name: 'auth-settings-languages' }">{{ $t('auth.settings.languages', 'Languages') }}</nuxt-link>
            </li>
            <li v-if="user && user.role === 'admin'">
              <nuxt-link :to="{ name: 'auth-settings-presentation' }">{{ $t('auth.settings.presentation', 'Presentation') }}</nuxt-link>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <transition name="slide-up" appear>
          <nuxt class="settings-content" />
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    head () {
      return {
        title: this.$t('auth.account.settings', 'Settings')
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        settings: 'settings/get',
        showInvites: 'settings/showInvites'
      })
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/settings/main";
</style>
