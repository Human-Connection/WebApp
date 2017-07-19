<template>
  <nav>
    <div class="container">
      <div class="nav-left">
        <nuxt-link class="logo" :to="{ name: 'index' }">
          <img src="/logo-hc.svg" alt="Human Connection">
        </nuxt-link>
        <nuxt-link class="nav-item is-tab" :to="{ name: 'index' }">
          Newsfeed
        </nuxt-link>
      </div>

      <!-- This "nav-menu" is hidden on mobile -->
      <!-- Add the modifier "is-active" to display it on mobile -->
      <div class="nav-right nav-menu">
        <a href="" class="nav-item">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </a>
        <notifications></notifications>
        <nuxt-link v-if="!isAuthenticated" :to="{ name: 'auth-login' }" class="nav-item is-tab">
          Login / Sign-In
        </nuxt-link>
        <template v-else>
          <nuxt-link :to="{ name: 'profile' }" class="nav-item is-tab">
            <hc-avatar :url="user.avatar"></hc-avatar>&nbsp;&nbsp;
          </nuxt-link>
          <a class="nav-item is-tab" @click.prevent="logout()">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
          </a>
        </template>
      </div>
    </div>
  </nav>
</template>


<script>
  import {mapGetters} from 'vuex'
  import Notifications from '../Notifications/Notifications.vue'
  import Avatar from '~components/Avatar/Avatar.vue'

  export default {
    name: 'hc-main-nav',
    components: {
      'hc-avatar': Avatar,
      'notifications': Notifications
    },
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        loading: false,
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      })
    },
    methods: {
      logout () {
        this.$store.dispatch('auth/logout')
          .then(() => {
            this.$router.replace('/')
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/styles/utilities";
  @import "~bulma/sass/components/nav.sass";

  nav {
    @extend .nav;
    // @extend .has-shadow;
    position: fixed !important;
    width: 100%;
    top: 0;
    border-bottom: 1px solid rgba(black, 0.15);

    .nuxt-link-exact-active {
      @extend a.nav-item.is-active;
      font-weight: bold;
    }
  }

  .nav-menu {
    overflow: visible;
  }

  .logo {
    display: inline-block;
    position: relative;
    height: 50px;
    width: 150px;
    text-align: left;
    padding: 8px 0 8px 15px;
    margin: 0;

    img {
      max-height: none;
      height: 100%;
      display: inline-block;
      position: relative;
    }
  }

  .nav-item .fa {
    font-size: 1.4rem;
  }
</style>
