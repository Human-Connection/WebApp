<template>
  <nav class="hc-navbar" @mouseleave="menuIsActive = false"
    role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="hc-navbar-menu" ref="navbar-container"
        :class="{ 'is-active': menuIsActive }">
        <div class="hc-navbar-item hc-navbar-brand">
          <nuxt-link class="hc-navbar-brand-logo"
            :to="{ name: 'index' }"
            :title="$t('component.layout.topbarLabel')"
            active-class="">
            <img class="is-hidden-mobile"
                 src="/logo-hc.svg"
                 alt="Human Connection"/>
            <img class="is-hidden-tablet"
                 src="/logo-hc-small.svg"
                 alt="Human Connection"/>
          </nuxt-link>
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
      filterForCategories (ids) {
        clearTimeout(this.filterThrottle)
        if (!isEqual(ids, this.selectedCategoryIds)) {
          this.filterThrottle = setTimeout(() => {
            this.applyCategoryFilter(ids)
          }, 1000)
        }
      },
      applyCategoryFilter (ids) {
        clearTimeout(this.filterThrottle)
        if (!isEqual(ids, this.selectedCategoryIds)) {
          this.selectedCategoryIds = ids
          this.$store.commit('search/categoryIds', ids)
        }
      },
      filterForEmotions (emotions) {
        clearTimeout(this.filterEmotionThrottle)
        if (!isEqual(emotions, this.selectedEmotions)) {
          this.filterEmotionThrottle = setTimeout(() => {
            this.applyEmotionFilter(emotions)
          }, 1000)
        }
      },
      applyEmotionFilter (emotions) {
        clearTimeout(this.filterEmotionThrottle)
        if (!isEqual(emotions, this.selectedEmotions)) {
          // get deselected emotions
          this.selectedEmotions = emotions
          this.$store.commit('search/emotions', this.selectedEmotions)
        }
      },
      async logout () {
        await this.$store.dispatch('auth/logout')
        this.$router.push('/auth/login')
      },
      changeLanguage (locale) {
        // TODO: make it a component
        // check if the locale has already been loaded
        if (this.$i18n.localeExists(locale)) {
          this.$i18n.set(locale)
          return
        }
        import(`~/locales/${locale}.json`)
          .then(res => {
            this.$i18n.add(locale, res)
            this.$i18n.set(locale)
          })
      },
      closeMenu: throttle(() => {
        app.menuIsActive = false
      }, 1000)
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
      height: $navbar-height - 20px;
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
