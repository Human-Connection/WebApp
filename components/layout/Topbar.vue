<template>
  <nav>
    <div class="container">
      <div class="nav-left">
        <nuxt-link class="logo" :to="{ name: 'index' }">
          <img class="is-hidden-mobile" src="/logo-hc.svg" alt="Human Connection">
          <img class="is-hidden-tablet" src="/logo-hc-small.svg" alt="Human Connection">
        </nuxt-link>
        <nuxt-link class="nav-item is-tab" :to="{ name: 'index' }">
          Newsfeed
        </nuxt-link>
      </div>

      <div class="nav-center">
        <search-input></search-input>
        <div class="navbar-item has-dropdown is-hoverable is-mega">
          <div class="navbar-link">
            <span class="icon">
              <i class="fa fa-filter"></i>
            </span>
          </div>
          <div class="navbar-dropdown">
            <div class="container is-fluid has-text-left">
              <div class="columns">
                <div class="column is-hidden">
                  <br/>
                  <h3 class="title is-6">Categories</h3>
                  <categories-select v-model="categoryIds"></categories-select>
                  <hr/>
                  <h3 class="title is-6">Emotions</h3>
                  <div>
                    <hc-emoji class="emotion" type="funny"></hc-emoji>
                    <hc-emoji class="emotion" type="happy"></hc-emoji>
                    <hc-emoji class="emotion" type="surprised"></hc-emoji>
                    <hc-emoji class="emotion" type="cry"></hc-emoji>
                    <hc-emoji class="emotion" type="angry"></hc-emoji>
                  </div>
                  <br/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-right nav-end">
        <a v-if="isAuthenticated" @click.prevent="null" class="nav-item is-disabled is-hidden-mobile" style="cursor: not-allowed;">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </a>
        <notifications v-if="isAuthenticated"></notifications>
        <div v-if="!isAuthenticated" class="navbar-item control is-grouped is-paddingless">
          <div class="login-button">
            <hc-button type="nuxt" class="is-primary" style="font-weight: bold;"
                       :to="{ name: 'auth-login', params: { path: this.$route.path } }">
              <span class="is-hidden-mobile">Login / Sign-Up &nbsp; </span><hc-icon icon="sign-in"/>
            </hc-button>
          </div>
        </div>
        <template v-else>
          <b-dropdown class="navigation-dropdown" position="is-bottom-left" style="text-align: left;">
            <a class="navbar-item" slot="trigger">
              <span><avatar :url="user.avatar"></avatar></span>
              <b-icon icon="arrow_drop_down"></b-icon>
            </a>
            <b-dropdown-item custom>
              Hello <b>{{ user.name }}</b>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item hasLink>
              <nuxt-link :to="{ name: 'profile' }">
                <b-icon icon="person"></b-icon>
                Profile
              </nuxt-link>
            </b-dropdown-item>
            <!--<b-dropdown-item value="settings" disabled>
              <i class="fa fa-sliders" style="padding-right: 5px;"></i>
              Settings
            </b-dropdown-item>
            <b-dropdown-item value="calendar" disabled>
              <b-icon icon="date_range"></b-icon>
              Calendar
            </b-dropdown-item>-->
            <b-dropdown-item v-if="isAdmin" hasLink value="admin">
              <nuxt-link to="/admin" class="nav-item">
                <b-icon icon="settings"></b-icon>
                Admin
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item value="help" disabled>
              <b-icon icon="help"></b-icon>
              Help
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item value="logout" @click="logout()">
              <b-icon icon="exit_to_app"></b-icon>
              Logout
            </b-dropdown-item>
          </b-dropdown>
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
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'

  export default {
    name: 'hc-topbar',
    components: {
      SearchInput,
      HcButton,
      Avatar,
      Notifications,
      CategoriesSelect
    },
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        loading: false,
        stayLoggedIn: false,
        errors: null,
        categoryIds: []
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
            this.$router.push('/')
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
    box-shadow: $card-shadow-hover;
    // border-bottom: 1px solid rgba(black, 0.15);
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

    .dropdown-content {
      border: none;
      .dropdown-item, .has-link a {
        padding: 0.7rem 1rem;
      }

      hr {
        margin: 0;
      }
    }
  }

  .navbar-item.is-mega {
    position: static;
    cursor: pointer;

    @include mobile() {
      display: none;
    }
    @include tablet-only() {
      display: none;
    }

    img.emotion {
      padding-right: 1rem;
      display: inline-block;
    }

    .navbar-dropdown {
      background-image: url("/filter-mock.png");
      background-size: cover;
      height: 510px;
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

  .nav-start, .nav-left, .nav-middle, .nav-right, .nav-end {
    overflow: visible;
  }

  .nav-end .login-button {
    align-items: center !important;
    display: flex;
    height: 100%;
  }

  .dropdown-trigger {
    &, & .navbar-item {
      align-items: center !important;
      display: flex !important;
    }
  }

  .logo {
    display: inline-block;
    position: relative;
    height: $topbar-height;
    width: 150px;
    text-align: left;
    padding: ($topbar-height - 40px)/2 0;
    margin: 0;

    @include mobile() {
      width: 50px;
    }

    img {
      max-height: none;
      height: 100%;
      display: inline-block;
      position: relative;
    }
  }

  .dropdown-item.is-disabled {
    cursor: default !important;
  }

  .nav-item .fa {
    font-size: 1.4rem;
  }

  @include mobile() {
    .nav-center {
      width: 30vw;
    }
  }

  .navigation-dropdown {
    & > hr, & > b-dropdown-item {
      visibility: hidden;
    }
  }
</style>
