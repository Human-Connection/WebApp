<template>
  <nav>
    <div class="container">
      <div class="nav-left">
        <div class="field">
          <p class="control has-icons-right">
            <input class="input" type="text" placeholder="Suchen ..." value="">
            <span class="icon is-small is-right">
              <hc-icon icon="search"></hc-icon>
            </span>
          </p>
        </div>
      </div>

      <div class="nav-center">
        <nuxt-link class="logo" :to="{ name: 'index' }">
          <img src="/logo-hc.svg" alt="Human Connection">
        </nuxt-link>
      </div>

      <div class="nav-right">
        <a href="" class="nav-item">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </a>
        <notifications></notifications>
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
  // Todo: search in component,
  // Todo: messages in component,
  // Todo: profile button in component

  import {mapGetters} from 'vuex'
  import Notifications from '../Notifications/Notifications.vue'

  export default {
    name: 'hc-topbar',
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
    padding-left: $sidebar-closed-width;

    .nuxt-link-exact-active {
      @extend a.nav-item.is-active;
      font-weight: bold;
    }
  }

  .nav-left {
    .field {
      display: flex;
      align-items: center;
    }

    .control {
      input {
        border-radius: 1em;
        height: 2em;
      }

      .icon {
        height: 2em;
      }
    }
  }

  .nav-left, .nav-middle, .nav-right {
    overflow: visible;
  }

  .logo {
    display: inline-block;
    position: relative;
    height: 50px;
    width: 150px;
    text-align: left;
    padding: 8px 0 8px 8px;
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
