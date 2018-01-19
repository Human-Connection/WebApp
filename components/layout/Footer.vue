<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <span v-html="$t('humanConnectionMadeWithHeart')"></span> | 
          <nuxt-link :to="{ name: 'legal' }">{{ $t('legal.imprint') }}</nuxt-link>
        </p>
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
  footer.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0.8em 5em;
    z-index: 50;
  }
</style>