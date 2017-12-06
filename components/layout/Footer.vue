<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p v-html="$t('humanConnectionMadeWithHeart')"></p>
        <p>
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
