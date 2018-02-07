<template>
  <no-ssr>
    <a v-if="$i18n.locale() === 'de'" @click="changeLanguage('en')" style="display: block; position: absolute; left: 1.5rem; top: 1rem;">
      <flag iso="de" :squared="false" title="" />
    </a>
    <a v-else @click="changeLanguage('de')" style="display: block; position: absolute; left: 1.5rem; top: 1rem;">
      <flag iso="gb" :squared="false" title="" />
    </a>
  </no-ssr>
</template>


<script>
  export default {
    name: 'hc-flag-switch',
    methods: {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  $icon-padding: ($sidebar-closed-width - $sidebar-icon-width)/2;

  .sidebar-menu {
    background-color: $white;
  }

  .menu-item {
    display: flex;
    position: relative;
    padding: 10px $icon-padding;
    margin-bottom: 5px;
    color: $grey-darker;
    align-items: center;
    width: 100%;
    transition: all 0.1s ease-out;
    letter-spacing: 0.05em;

    &:hover {
      background-color: $white-ter;
    }

    &.nuxt-link-exact-active {
      background-color: $white-ter;
    }
  }

  .menu-icon {
    display: inline-flex;
    margin-right: $icon-padding + 2px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    color: $grey-dark;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    transition: all 0.1s ease-out;

    .nuxt-link-exact-active & {
      color: $white;
      background-color: $primary;
    }
  }
</style>
