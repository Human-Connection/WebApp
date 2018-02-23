<template>
  <hc-dropdown>
    <hc-navbar-button slot="toggle">
      <hc-avatar :user="user"/>
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
    </div>
  </hc-dropdown>
</template>


<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'hc-user-menu',
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
  @import "~bulma/sass/components/navbar";

  .hc-user-menu {
    min-width: 180px;
    padding: 0.5rem 0 0.6rem;
  }
</style>
