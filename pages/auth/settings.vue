<template>
  <section class="container account-settings">
    <h2 class="title is-2">{{ $t('auth.account.settings') }}</h2>
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
        <transition name="slide-up" appear>
          <nuxt class="settings-content"/>
        </transition>
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
  @import "assets/styles/settings/main";
</style>
