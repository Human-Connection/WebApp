<template>
  <div class="field is-grouped">
    <no-ssr>
      <div class="navbar-item locales has-dropdown is-hoverable">
        <a class="navbar-link hide-in-menu">
          <img class="flag"
               :src="`/assets/svg/flags/${this.$i18n.locale()}.svg`"/>
        </a>
        <div class="navbar-dropdown is-boxed">
          <a class="navbar-item"
             @click.prevent="changeLanguage('de')"
             :class="{ active: $i18n.locale() === 'de' }">
            <img class="flag" :src="`/assets/svg/flags/de.svg`"/>
            &nbsp;&nbsp;Deutsch
          </a>
          <a class="navbar-item"
            @click.prevent="changeLanguage('en')"
            :class="{ active: $i18n.locale() === 'en' }">
            <img class="flag" :src="`/assets/svg/flags/en.svg`"/>
            &nbsp;&nbsp;English
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
</template>


<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'hc-language-select',
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    methods: {
      changeLanguage (locale) {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .flag {
    width: 20px;
    height: 15px;
  }

  .navbar-start {
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

  .navbar-item .fa {
    font-size: 1.4rem;
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
</style>
