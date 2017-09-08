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

      <div class="nav-center">
        <search-input></search-input>
      </div>

      <div class="nav-right nav-end">
        <nuxt-link v-if="isAdmin" to="/admin" class="nav-item">
          <hc-icon icon="cog"></hc-icon>
        </nuxt-link>
        <a v-if="isAuthenticated" href="" class="nav-item">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </a>
        <notifications v-if="isAuthenticated"></notifications>
        <div v-if="!isAuthenticated" class="navbar-item">
          <div class="field is-grouped">
            <div class="control">
              <hc-button type="nuxt" class="is-primary"
                         style="font-weight: bold;"
                         :to="{ name: 'auth-login', params: { path: this.$route.path } }">Login / Sign-In</hc-button>
            </div>
          </div>
        </div>
        <template v-else>
          <nuxt-link :to="{ name: 'profile' }" class="nav-item is-tab">
            <avatar :url="user.avatar"></avatar>&nbsp;&nbsp;
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
  // Todo: search in component,
  // Todo: messages in component,
  // Todo: profile button in component

  import {mapGetters} from 'vuex'
  import Notifications from '~/components/Notifications/Notifications.vue'
  import Avatar from '~/components/Avatar/Avatar.vue'
  import HcButton from '../Global/Elements/Button/Button.vue'
  import SearchInput from '../Search/SearchInput.vue'

  export default {
    name: 'hc-topbar',
    components: {
      SearchInput,
      HcButton,
      Avatar,
      Notifications
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
        isAdmin: 'auth/isAdmin',
        user: 'auth/user'
      })
    },
    mounted () {
      console.log(this.$route.path)
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
  @import "assets/styles/utilities";
  @import "~bulma/sass/components/nav.sass";

  nav {
    @extend .nav;
    // @extend .has-shadow;
    box-shadow: 0 2px 5px rgba($black, 0.05);
    border-bottom: 1px solid rgba(black, 0.15);
    z-index: 130;
    pointer-events: all;
    height: $topbar-height;
    padding: 0 20px;

    .active-link {
      @extend a.nav-item.is-active;
      font-weight: bold;
    }

    @include desktop() {
      padding: 0;
    }
  }

  .mobile-toggle {
    position: relative;
    background-color: $white-ter;
    margin-right: 10px;

    @include tablet() {
      display: none;
    }
  }

  .nav-left, .nav-middle, .nav-right {
    overflow: visible;
  }

  .logo {
    display: inline-block;
    position: relative;
    height: $topbar-height;
    width: 150px;
    text-align: left;
    padding: ($topbar-height - 40px)/2 0;
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
