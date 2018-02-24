<template>
  <hc-dropdown :mobileFull="true">
    <hc-navbar-button slot="toggle">
      <hc-avatar :user="user" class="is-hidden-mobile" />
      <hc-icon icon="bars" class="is-hidden-tablet" />
    </hc-navbar-button>
    <div class="hc-user-menu">
      <hc-navbar-item :static="true">
        <span v-html="$t('auth.account.helloUser', {username: (user && user.name) ? user.name : 'Anonymous'})"></span>
      </hc-navbar-item>
      <hr class="navbar-divider">
      <hc-navbar-item to="/profile">
        {{ $t('auth.account.profile') }}
      </hc-navbar-item>
      <hc-navbar-item v-if="isAdmin" to="/admin">
        {{ $t('component.admin.label') }}
      </hc-navbar-item>
      <hr class="navbar-divider">
      <hc-navbar-item v-if="isAdmin" @click="logout()">
        {{ $t('auth.logout.label') }}
      </hc-navbar-item>
      <div class="is-hidden-tablet">
        <language-select></language-select>
      </div>
    </div>
  </hc-dropdown>
</template>


<script>
  import {mapGetters} from 'vuex'
  import LanguageSelect from '~/components/layout/LanguageSelect.vue'

  export default {
    name: 'hc-user-menu',
    components: {
      LanguageSelect
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        isAdmin: 'auth/isAdmin',
        user: 'auth/user'
      })
    },
    methods: {
      logout () {
        this.$store.dispatch('auth/logout')
          .then(() => {
            this.$router.push('/auth/login')
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-user-menu {
    min-width: 180px;
    padding: 0.5rem 0 0.6rem;
  }
</style>
