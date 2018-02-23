<template>
  <no-ssr>
    <hc-dropdown>
      <hc-navbar-button slot="toggle">
        <img class="flag"
          :src="`/assets/svg/flags/${this.$i18n.locale()}.svg`"/>
      </hc-navbar-button>
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
    height: 15px;
  }

  .hc-language-select {
    padding: 0.5rem;
  }

  .hc-language-label {
    margin-left: 7px;
    font-weight: bold;
  }
</style>
