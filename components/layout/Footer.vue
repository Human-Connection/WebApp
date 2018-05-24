<template>
  <footer class="footer">
    <div class="container">
      <div class="content">
        <a href="https://human-connection.org"
           target="_blank"
           v-html="$t('humanConnectionMadeWithHeart')" /> &nbsp;⏐&nbsp;
        <hc-button
              type="link"
              to="/pages/imprint"
              :prevent="true"
              @click="$openInModal({slug: 'imprint'})">
          {{ $t('legal.imprint') }}
        </hc-button> &nbsp;‑&nbsp;
        <hc-button
              type="link"
              to="/pages/terms-and-conditions"
              :prevent="true"
              @click="$openInModal({slug: 'terms-and-conditions'})">
          {{ $t('legal.termsAndConditions') }}
        </hc-button> &nbsp;‑&nbsp;
        <hc-button
              type="link"
              to="/pages/data-privacy"
              :prevent="true"
              @click="$openInModal({slug: 'data-privacy'})">
          {{ $t('legal.dataPrivacy') }}
        </hc-button>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'hc-footer',
    methods: {
      openLegalInfo (e) {
        switch (e.target.getAttribute('data-page')) {
          case 'imprint':
            e.preventDefault()
            this.$openInModal({slug: 'imprint'})
            break;
          case 'terms-and-conditions':
            e.preventDefault()
            this.$openInModal({slug: 'terms-and-conditions'})
            break;
            break;
          case 'data-privacy':
            e.preventDefault()
            this.$openInModal({slug: 'data-privacy'})
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  footer.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0.8em 1em;
    z-index: 50;

    .content {
      text-align: center;
    }
  }

  @media (max-width: $tablet) {
    footer.footer .content {
      padding-left: 1em;
      padding-right: 7em;
      text-align: left;
    }
  }
</style>
