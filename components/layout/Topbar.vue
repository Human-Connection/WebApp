<template>
  <nav class="navbar" @mouseleave="menuIsActive = false">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item logo" :to="{ name: 'index' }" :title="$t('component.layout.topbarLabel')">
          <img class="is-hidden-mobile" src="/logo-hc.svg" alt="Human Connection">
          <img class="is-hidden-tablet" src="/logo-hc-small.svg" alt="Human Connection">
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
            <div class="field is-grouped">
              <no-ssr>
                <div class="navbar-item locales has-dropdown is-hoverable">
                  <a class="navbar-link hide-in-menu">
                    <flag :iso="getLocaleFlag" :squared="false" title="" />
                  </a>
                  <div class="navbar-dropdown is-boxed">
                    <a class="navbar-item" @click.prevent="changeLanguage('de')" :class="{ active: $i18n.locale() === 'de' }">
                      <flag iso="de" :squared="false" title="" />&nbsp;&nbsp;Deutsch
                    </a>
                    <a class="navbar-item" @click.prevent="changeLanguage('en')" :class="{ active: $i18n.locale() === 'en' }">
                      <flag iso="gb" :squared="false" title="" />&nbsp;&nbsp;English
                    </a>
                  </div>
                </div>
              </no-ssr>
              <div v-if="false" class="navbar-item is-hoverable">
                <nuxt-link class="navbar-item" :to="{ name: 'index' }">
                  <!-- TODO $t('component.dashboard.label') ? -->
                  {{ $t('component.layout.topbarLabel') }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-center">
          <div class="navbar-item">
            <div class="field is-grouped">
              <div class="navbar-item navbar-search">
                <search-input></search-input>
              </div>
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link hide-in-menu">
                  <span class="icon">
                    <i class="fa fa-filter"></i>
                  </span>
                </a>
                <div class="navbar-dropdown navbar-filter is-boxed">
                  <div class="container is-fluid has-text-left">
                    <div class="columns">
                      <div class="column">
                        <no-ssr>
                          <hc-tooltip :label="$t('component.layout.topbarFilterDescription')"
                                     position="is-right"
                                     size="is-large"
                                     multilined>
                            <h6 class="title is-6">
                              {{ $t('component.category.labelLongOnePluralNone', 'Categories', null, categories.length) }} <hc-icon set="fa" icon="question-circle" />
                            </h6>
                          </hc-tooltip>
                        </no-ssr>
                        <filter-list @change="filterForCategories"
                                     :items="categories"
                                     translationPath="component.category.slug2label-"
                                     :selected="selectedCategoryIds" />
                        <hr/>
                        <h6 class="title is-6">Emotions</h6>
                        <filter-list @change="applyEmotionFilter"
                                     :items="emotions"
                                     :selected="selectedEmotions"
                                     iconSet="hc-emoji" />
                        <br/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field is-grouped">
              <template v-if="isAuthenticated">
                <notifications></notifications>
                <div class="navbar-item has-dropdown is-hoverable">
                  <nuxt-link class="navbar-link hide-in-menu"
                             :to="{ name: 'profile' }">
                    <avatar :url="user.avatar"></avatar>
                  </nuxt-link>
                  <div class="navbar-dropdown user-menu is-boxed is-right">
                    <div class="navbar-item" v-html="$t('auth.account.helloUser', {username: user ? user.name : ''})"></div>
                    <hr class="navbar-divider">

                    <nuxt-link class="navbar-item" :to="{ name: 'profile' }">
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
              <template v-else>
                <hc-button type="nuxt"
                           class="is-primary login-button"
                           style="font-weight: bold;"
                           :to="{ name: 'auth-login', params: { path: this.$route.path } }">
                  <span class="is-hidden-mobile">{{ $t('auth.account.loginOrRegister') }} &nbsp; </span><hc-icon icon="sign-in"/>
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
  // Todo: search in component,
  // Todo: messages in component,
  // Todo: profile button in component

  import {mapGetters} from 'vuex'
  import Notifications from '~/components/Notifications/Notifications.vue'
  import Avatar from '~/components/Avatar/Avatar.vue'
  import HcButton from '../Global/Elements/Button/Button.vue'
  import SearchInput from '../Search/SearchInput.vue'
  import FilterList from '~/components/Filters/FilterList.vue'

  import _ from 'lodash'

  let app = this

  export default {
    name: 'hc-topbar2',
    components: {
      SearchInput,
      HcButton,
      Avatar,
      Notifications,
      FilterList
    },
    data () {
      app = this
      return {
        menuIsActive: false,
        loading: false,
        stayLoggedIn: false,
        errors: null,
        selectedCategoryIds: [],
        selectedEmotions: [],
        filterThrottle: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        isAdmin: 'auth/isAdmin',
        user: 'auth/user',
        categories: 'categories/all'
      }),
      getLocaleFlag () {
        const flags = {
          en: 'gb',
          us: 'gb',
          de: 'de'
        }
        return flags[this.$i18n.locale()]
      },
      emotions () {
        return [
          {
            _id: 'funny',
            title: this.$t('component.emotionRating.funny'),
            icon: 'funny'
          },
          {
            _id: 'happy',
            title: this.$t('component.emotionRating.happy'),
            icon: 'happy'
          },
          {
            _id: 'surprised',
            title: this.$t('component.emotionRating.surprised'),
            icon: 'surprised'
          },
          {
            _id: 'cry',
            title: this.$t('component.emotionRating.cry'),
            icon: 'cry'
          },
          {
            _id: 'angry',
            title: this.$t('component.emotionRating.angry'),
            icon: 'angry'
          }
        ]
      }
    },
    watch: {
      categories (categories) {
        this.applyCategoryFilter(_.map(categories, '_id'))
      },
      '$route' () {
        this.closeMenu()
      }
    },
    mounted () {
      // TODO: aplly filters from user config or local storage, but keep them between sessions
      this.applyCategoryFilter(_.map(this.categories, '_id'))
      this.applyEmotionFilter(_.map(this.emotions, '_id'))

      window.addEventListener('resize', this.closeMenu)
    },
    destroy () {
      window.removeEventListener('resize', this.closeMenu)
    },
    methods: {
      filterForCategories (ids) {
        clearTimeout(this.filterThrottle)
        if (!_.isEqual(ids, this.selectedCategoryIds)) {
          this.filterThrottle = setTimeout(() => {
            this.applyCategoryFilter(ids)
          }, 1000)
        }
      },
      applyCategoryFilter (ids) {
        clearTimeout(this.filterThrottle)
        if (!_.isEqual(ids, this.selectedCategoryIds)) {
          this.selectedCategoryIds = ids
          this.$store.commit('search/categoryIds', ids)
        }
      },
      applyEmotionFilter (emotions) {
        if (!_.isEqual(emotions, this.selectedEmotions)) {
          // get deselected emotions
          this.selectedEmotions = emotions
          this.$store.commit('search/emotions', this.selectedEmotions)
        }
      },
      logout () {
        this.$store.dispatch('auth/logout')
          .then(() => {
            this.$router.push('/')
          })
          .catch(err => {
            console.error(err)
          })
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
            console.log('LOCALE', res)
            this.$i18n.add(locale, res)
            this.$i18n.set(locale)
          })
      },
      closeMenu: _.throttle(() => {
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

  .user-menu {
    min-width: 13rem;

    & > .navbar-item {
      display: block;
    }
  }

  /*.user-menu {
    margin-left: 0;
    .navbar-item {
      padding-left: .5rem;
      padding-right: 0;
    }
  }*/

  /*.navbar-end .login-button {
    align-items: center !important;
    display: flex;
    height: 100%;
  }*/


  .logo {
    display: inline-block;
    position: relative;
    height: $navbar-height;
    width: 150px;
    text-align: left;
    padding: ($navbar-height - 40px)/2 0;
    margin:     0 0 0 1rem;

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

  @include mobile() {
    .navbar-center {
      // width: 30vw;
    }
  }

  .locales .navbar-dropdown {
    .flag-icon {
      opacity: 0.5;
      transition: opacity 150ms ease-in-out;
    }
    .active {
      font-weight: bold;

      .flag-icon {
        opacity: 1;
      }
    }

    a:hover {
      .flag-icon {
        opacity: 1;
      }
    }
  }

  /* fix rendering issues */
  /*.navigation-dropdown {
    & > hr, & > b-dropdown-item {
      visibility: hidden;
    }
  }*/

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

  .navbar-filter {
    @include unselectable();
  }

  .navbar-dropdown.navbar-filter {
    padding-top: 2em;
    max-height: 100vh;
    overflow: auto;
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
