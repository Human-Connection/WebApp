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
              to="/pages/privacy"
              :prevent="true"
              @click="$openInModal({slug: 'privacy'})">
          {{ $t('legal.dataPrivacy') }}
        </hc-button> &nbsp;‑&nbsp;
        <hc-button
              type="link"
              to="/pages/changelog"
              :prevent="true"
              @click="$openInModal({slug: 'changelog'})">
          {{ $t('page.changelog.title') }}
        </hc-button>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'hc-footer'
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
