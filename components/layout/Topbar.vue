<template>
  <nav class="navbar" @mouseleave="menuIsActive = false" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link
          class="navbar-item logo"
          :to="{ name: 'index' }"
          :title="$t('component.layout.topbarLabel')"
          active-class="">
          <img class="is-hidden-mobile"
               src="/logo-hc.svg" alt="Human Connection"/>
          <img class="is-hidden-tablet"
               src="/logo-hc-small.svg" alt="Human Connection"/>
        </nuxt-link>
        <div class="navbar-burger burger"
             :class="{ 'is-active': menuIsActive }"
             @click.prevent="menuIsActive = !menuIsActive">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': menuIsActive }">
        <div class="navbar-start">
          <div class="navbar-item">
            <language-select></language-select>
          </div>
        </div>

        <div class="navbar-center">
          <div class="navbar-item">
            <div class="field is-grouped">
              <div class="navbar-item navbar-search">
                <search-input></search-input>
              </div>
              <filter-select></filter-select>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field is-grouped">
              <template v-if="isAuthenticated">
                <notifications></notifications>
                <user-menu></user-menu>
              </template>
              <template v-else>
                <hc-button
                  type="nuxt"
                  class="is-primary login-button"
                  style="font-weight: bold;"
                  :to="{ name: 'auth-login', params: { path: this.$route.path } }">
                  <span class="is-hidden-mobile">
                    {{ $t('auth.account.loginOrRegister') }}
                    &nbsp; </span>
                  <hc-icon icon="sign-in"/>
                </hc-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
  import {mapGetters} from 'vuex'
  import LanguageSelect from '~/components/layout/LanguageSelect.vue'
  import SearchInput from '../Search/SearchInput.vue'
  import FilterSelect from '~/components/layout/FilterSelect.vue'
  import Notifications from '~/components/Notifications/Notifications.vue'
  import UserMenu from '~/components/layout/UserMenu.vue'

  import {throttle} from 'lodash'

  let app = this

  export default {
    name: 'hc-topbar',
    components: {
      LanguageSelect,
      SearchInput,
      FilterSelect,
      Notifications,
      UserMenu
    },
    data () {
      app = this
      return {
        menuIsActive: false,
        isLoading: false,
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated'
      })
    },
    watch: {
      '$route' () {
        this.closeMenu()
      }
    },
    mounted () {
      window.addEventListener('resize', this.closeMenu)
    },
    destroy () {
      window.removeEventListener('resize', this.closeMenu)
    },
    methods: {
      closeMenu: throttle(() => {
        app.menuIsActive = false
      }, 1000)
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";
  @import "~bulma/sass/components/navbar";

  nav {
    box-shadow: $card-shadow-hover;
    z-index: 130;
    pointer-events: all;
    height: $navbar-height;

    .active-link {
      @extend a.navbar-item.is-active;
      font-weight: bold;
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

  .logo {
    display: inline-block;
    position: relative;
    height: $navbar-height;
    width: 150px;
    text-align: left;
    padding: ($navbar-height - 40px)/2 0;
    margin: 0 0 0 1rem;

    &, &:hover {
      background-color: transparent !important;
    }

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

  .navbar-item .fa {
    font-size: 1.4rem;
  }

  .navbar-burger {
    height: $navbar-height;
    padding-left: 2em;
    padding-right: 2em;
  }

  .navbar-menu.is-active {
    .hide-in-menu {
      display: none;
    }

    max-height: 100vh;
    overflow: auto;

    .navbar-center {
      .field.is-grouped {
        justify-content: right;
      }
    }

    .navbar-end {
      padding-bottom: $navbar-height * 2 !important;
    }
  }

  .navbar-center {
    align-items: stretch;
    display: flex;
    padding-right: 5rem;

    .title.is-5,
    .title.is-6 {
      padding-top: 1em;
      padding-bottom: 2em;
      padding-left: 1em;

      margin-bottom: 0;

      color: $grey-dark;

      i {
        font-size: 1em;
      }
    }

    &, & > .navbar-item {
      padding-top: 0;
      padding-bottom: 0;
      height: 100%;
    }

    &, .navbar-item {
      position: initial;
    }
  }

  .is-active {
    .navbar-dropdown.navbar-filter {
      overflow: visible;
      width: 100%;
      height: auto;
      max-height: none;
    }

    .navbar-center {
      padding-right: 0;

      &, .navbar-item, .field.is-grouped {
        display: block !important;
        justify-content: normal !important;
      }

      .navbar-search {
        overflow: visible;
        width: 100%;
        height: auto;

        .field, .control, input {
          width: 100%;
        }
      }
    }
  }
</style>
