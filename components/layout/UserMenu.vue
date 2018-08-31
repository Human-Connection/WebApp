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
      <hc-navbar-item :static="true" v-if="user && user.role !== 'user'" class="is-hidden-mobile user-role">
        <small>{{ user.role }}</small>
      </hc-navbar-item>
      <hr class="navbar-divider">
      <hc-navbar-item class="nav-item" :to="{name: 'profile-slug', params: {slug: this.user.slug}}" @click.native="close()">
        <span class="icon">
          <hc-icon class="icon-left" icon="user"/>
        </span> {{ $t('auth.account.profile') }}
      </hc-navbar-item>
      <hc-navbar-item class="nav-item" to="/auth/settings" @click.native="close()">
        <span class="icon">
          <hc-icon class="icon-left" icon="sliders"/>
        </span> {{ $t('auth.account.settings') }}
      </hc-navbar-item>
      <hc-navbar-item class="nav-item" v-if="isAdmin" to="/admin" @click.native="close()">
        <span class="icon">
          <hc-icon class="icon-left" icon="wrench"/>
        </span> {{ $t('component.admin.label') }}
      </hc-navbar-item>
      <hr class="navbar-divider">
      <hc-navbar-item class="nav-item is-hidden-mobile" @click="logout()" >
        <span class="icon">
          <hc-icon class="icon-left" icon="sign-out"/>
        </span> {{ $t('auth.logout.label') }}
      </hc-navbar-item>
      <div class="is-hidden-tablet">
        <language-select></language-select>
      </div>
    </div>
    <div slot="footer">
      <hc-button @click="logout()"
        color="light"
        size="medium"
        class="nav-item logout-button"
        :fullWidth="true">
        <hc-icon class="icon-left" icon="sign-out"/> {{ $t('auth.logout.label') }}
      </hc-button>
      <hc-button @click="close()"
        size="medium"
        :fullWidth="true"
        class="nav-item">
        <hc-icon class="icon-left" icon="times"/> {{ $t('button.close', 'Close') }}
      </hc-button>
    </div>
  </hc-dropdown>
</template>


<script>
  import {mapGetters} from 'vuex'
  import LanguageSelect from './LanguageSelect.vue'

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
      }),
    },
    methods: {
      logout () {
        this.$router.push({name: 'auth-logout'})
      },
      close () {
        this.$refs.dropdown.close()
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-user-menu {
    min-width: 180px;
    padding: 0.5rem 0 0.6rem;
  }

  @media (min-width: $tablet) {
    .navbar-divider {
      display: block !important;
    }
  }

  // .nav-item {
  //   justify-content: space-between;
  // }

  .icon {
    text-align: left;
    padding-left: 0;
    width: 1.5em;
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

  .user-role {
    padding-top: 0;
    padding-bottom: 0;
    margin-top: -1rem;
    color: lighten($grey, 10%) !important;
    text-transform: capitalize;
  }
</style>
