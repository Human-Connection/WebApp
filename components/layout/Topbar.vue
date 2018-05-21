<template>
  <nav class="hc-navbar" @mouseleave="menuIsActive = false"
    role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="hc-navbar-menu" ref="navbar-container"
        :class="{ 'is-active': menuIsActive }">
        <div class="hc-navbar-item hc-navbar-brand">
          <h1 class="is-hidden">Human-Connection</h1>
          <a class="hc-navbar-brand-logo"
             @click="onLogoClick"
             :title="$t('component.layout.topbarLabel')"
             active-class="">
            <img class="is-hidden-mobile"
                 src="/Logo-Horizontal-Alpha.svg"
                 alt="Human-Connection.org"/>
            <img class="is-hidden-tablet"
                 src="/Logo-Globe-Alpha.svg"
                 alt="Human-Connection.org"/>
          </a>
        </div>
        <div class="hc-navbar-item hc-navbar-search">
          <top-search></top-search>
        </div>
        <div class="hc-navbar-item hc-navbar-filter">
          <filter-select></filter-select>
        </div>
        <div class="hc-navbar-right">
          <div class="hc-navbar-item hc-navbar-language is-hidden-mobile">
            <language-select></language-select>
          </div>
          <div class="hc-navbar-item hc-navbar-notifications">
            <notifications></notifications>
          </div>
          <div class="hc-navbar-item hc-navbar-user-menu">
            <template v-if="isAuthenticated">
              <user-menu id="user-menu"></user-menu>
            </template>
            <template v-else>
              <hc-button
                type="nuxt"
                class="is-primary login-button"
                style="font-weight: bold;"
                :to="{ name: 'auth-login', params: { path: this.$route.path } }">
                  <span class="is-hidden-mobile">{{ $t('auth.account.loginOrRegister') }}</span>
                  <hc-icon class="icon-left" icon="sign-in"/>
              </hc-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
  import {mapGetters} from 'vuex'
  import LanguageSelect from '~/components/layout/LanguageSelect.vue'
  import TopSearch from '~/components/layout/TopSearch.vue'
  import FilterSelect from '~/components/layout/FilterSelect.vue'
  import Notifications from '~/components/Notifications/Notifications.vue'
  import UserMenu from '~/components/layout/UserMenu.vue'

  import {throttle} from 'lodash'

  let app = this

  export default {
    name: 'hc-topbar',
    components: {
      LanguageSelect,
      TopSearch,
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
      }, 1000),
      onLogoClick () {
        this.$store.commit('newsfeed/clear')
        this.$store.dispatch('newsfeed/fetch')
        this.$router.push({ name: 'index' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-navbar {
    box-shadow: $card-shadow-hover;
    z-index: 130;
    pointer-events: all;
    height: $navbar-height;
    background-color: $white;
  }

  .hc-navbar-menu {
    display: flex;
    justify-content: space-between;
    position: relative;

    & > div {
      display: flex;
    }

    @include until($tablet) {
      justify-content: flex-start;
    }
  }

  .hc-navbar-item {
    display: flex;
    height: $navbar-height;
    user-select: none;

    @include until($tablet) {
      flex: 0 0 20vw !important;
      justify-content: center;
      border-right: 1px solid $white-dar;

      &.hc-navbar-user-menu {
        border-right: 0;
      }
    }
  }

  .hc-navbar-brand {
    margin-right: 40px;

    @include until($desktop) {
      margin-left: 1rem;
      margin-right: 2rem;
    }

    @include until($tablet) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .hc-navbar-brand-logo {
    display: flex;
    height: $navbar-height;
    align-items: center;

    img {
      height: 40px;
      width: auto;
    }
  }

  .hc-navbar-search {
    flex: 1 1 0;
  }

  .hc-navbar-right {
    margin-left: 15%;

    @include until($desktop) {
      margin-left: 2rem;
    }

    @include until($tablet) {
      margin-left: 0;
    }
  }
</style>
