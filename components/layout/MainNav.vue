<template>
  <nav>
    <div class="container">
      <div class="nav-left">
        <nuxt-link class="logo" :to="{ name: 'index' }">
          <img src="/logo-hc.svg" alt="Human Connection">
        </nuxt-link>
        <a href="" class="nav-item">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </a>
        <notifications></notifications>
      </div>

      <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
      <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
      <span class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
                </span>

      <!-- This "nav-menu" is hidden on mobile -->
      <!-- Add the modifier "is-active" to display it on mobile -->
      <div class="nav-right nav-menu">
        <nuxt-link class="nav-item is-tab" :to="{ name: 'index' }">
          Dashboard
        </nuxt-link>
        <nuxt-link v-if="!isAuthenticated" :to="{ name: 'auth-login' }" class="nav-item is-tab">
          Login
        </nuxt-link>
        <template v-else>
          <nuxt-link :to="{ name: 'profile' }" class="nav-item is-tab">
            <span v-if="user.name">Hallo&nbsp;{{user.name}}!</span>
            <span v-else>Mein Profil</span>
          </nuxt-link>
          <a class="nav-item is-tab" @click.prevent="logout()">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
          </a>
        </template>
        <!--<nuxt-link v-else class="nav-item">-->
        <!--Logout-->
        <!--</nuxt-link>-->
      </div>
    </div>
  </nav>
</template>


<script>
  import {mapGetters} from 'vuex'
  import Notifications from '../Notifications/Notifications.vue'

  export default {
    name: 'hc-main-nav',
    components: {
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
    @extend .has-shadow;
    position: fixed !important;
    width: 100%;
    top: 0;

    .nuxt-link-exact-active {
      @extend a.nav-item.is-active;
      font-weight: bold;
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
  }

  .nav-left {
    overflow: visible;

    .fa {
        font-size: 1.4rem;
    }
  }
</style>
