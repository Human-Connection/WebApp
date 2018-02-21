<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <nuxt-link class="navbar-link hide-in-menu" to="/profile">
      <hc-avatar :user="user"/>
    </nuxt-link>
    <div class="navbar-dropdown user-menu is-boxed is-right">
      <div class="navbar-item"
           v-html="$t('auth.account.helloUser', {username: (user && user.name) ? user.name : 'Anonymous'})">
      </div>
      <hr class="navbar-divider">
      <nuxt-link class="navbar-item" to="/profile">
        {{ $t('auth.account.profile') }}
      </nuxt-link>
      <nuxt-link class="navbar-item" v-if="isAdmin" to="/admin">
        {{ $t('component.admin.label') }}
      </nuxt-link>
      <hr class="navbar-divider">
      <a class="navbar-item" @click.prevent="logout()">
        {{ $t('auth.logout.label') }}
      </a>
    </div>
  </div>
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

  .navbar-start, .navbar-center, .navbar-end {
    overflow: visible;

    @include tablet() {
      align-items: center;
      align-content: center;
      justify-content: flex-start;
    }

    .navbar-link:hover,
    .navbar-item:hover {
      &,
      & .navbar-item,
      & .navbar-link {
        background-color: transparent !important;

        a &.navbar-link {
          color: $link;
        }
      }
    }

  }

  .user-menu {
    min-width: 13rem;

    & > .navbar-item {
      display: block;
    }
  }

  .dropdown-item.is-disabled {
    cursor: default !important;
  }

  .navbar-item .fa {
    font-size: 1.4rem;
  }
</style>
