<template>
  <hc-dropdown ref="dropdown"
    :mobileFull="true"
    :persist="true"
    :hideFooterTablet="true">
    <hc-navbar-button slot="toggle">
      <hc-avatar :user="user" class="is-hidden-mobile" />
      <hc-icon icon="bars" class="is-hidden-tablet" />
    </hc-navbar-button>
    <hc-dropdown-title class="is-hidden-tablet">
      <nuxt-link class="mobile-user-header"
        to="/profile" @click.native="close()">
        <span v-html="$t('auth.account.helloUser', {username: (user && user.name) ? user.name : 'Anonymous'})"></span>
        <hc-avatar :user="user" />
      </nuxt-link>
    </hc-dropdown-title>
    <div class="hc-user-menu">
      <hc-navbar-item :static="true" class="is-hidden-mobile">
        <span v-html="$t('auth.account.helloUser', {username: (user && user.name) ? user.name : 'Anonymous'})"></span>
      </hc-navbar-item>
      <hr class="navbar-divider">
      <hc-navbar-item to="/profile" @click.native="close()">
        {{ $t('auth.account.profile') }}
      </hc-navbar-item>
      <hc-navbar-item v-if="isAdmin" to="/admin" @click.native="close()">
        {{ $t('component.admin.label') }}
      </hc-navbar-item>
      <hr class="navbar-divider">
      <hc-navbar-item @click="logout()" class="is-hidden-mobile">
        {{ $t('auth.logout.label') }}
      </hc-navbar-item>
      <div class="is-hidden-tablet">
        <language-select></language-select>
      </div>
    </div>
    <div slot="footer">
      <hc-button @click="logout()"
        color="light"
        size="medium"
        class="logout-button"
        :fullWidth="true">
        {{ $t('auth.logout.label') }}
      </hc-button>
      <hc-button @click="close()"
        size="medium"
        :fullWidth="true">
        {{ $t('button.close', 'Close') }}
      </hc-button>
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
      },
      close () {
        this.$refs.dropdown.close()
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

  .mobile-user-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $grey-darker;
  }

  .logout-button {
    margin-bottom: 0.7rem;
  }
</style>
