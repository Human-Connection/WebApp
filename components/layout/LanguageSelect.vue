<template>
  <no-ssr>
    <hc-dropdown ref="dropdown"
      :hideFooterTablet="true">
      <div slot="toggle">
        <hc-navbar-button class="is-hidden-mobile">
          <img class="flag"
            :src="`/assets/svg/flags/${this.$i18n.locale()}.svg`"/>
        </hc-navbar-button>
        <hc-navbar-item class="is-hidden-tablet">
          <img class="flag mobile-flag"
            :src="`/assets/svg/flags/${this.$i18n.locale()}.svg`"/>
          {{ $t('auth.account.languageSettings') }}
        </hc-navbar-item>
      </div>
      <div class="hc-language-select">
        <hc-navbar-item v-for="language in languages"
          :key="language.locale"
          @click="changeLanguage(language.locale)"
          :active="$i18n.locale() === language.locale">
          <img class="flag" :src="`/assets/svg/flags/${language.locale}.svg`"/>
          <span class="hc-language-label">
            {{ language.label }}
          </span>
        </hc-navbar-item>
      </div>
      <div slot="footer">
        <hc-button @click="$refs.dropdown.close()"
          size="medium"
          :fullWidth="true">
          {{ $t('button.back', 'Back') }}
        </hc-button>
      </div>
    </hc-dropdown>
  </no-ssr>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'hc-language-select',
    data () {
      return {
        languages: [
          {
            locale: 'de',
            label: 'Deutsch'
          },
          {
            locale: 'en',
            label: 'English'
          }
        ]
      }
    },
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
    max-width: none;
    height: 15px;
    position: relative;
    top: 0.05em;
  }

  .mobile-flag {
    margin-right: 0.5rem;
  }

  .hc-language-select {
    padding: 0.5rem 0;
  }

  .hc-language-label {
    margin-left: 7px;
    font-weight: bold;
  }
</style>
