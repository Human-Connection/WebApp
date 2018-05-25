<template>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li :class="{ 'is-active': isCurrentPage(`/contributions/${this.contribution.slug}`) }">
        <nuxt-link :to="{ path: `/contributions/${this.contribution.slug}` }">
          1. {{ $t('component.contribution.type-' + contribution.type) }}
        </nuxt-link>
      <li :class="{ 'is-active': isCurrentPage(`/contributions/more-info/`) }">
        <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }">
          2. {{ $t('component.contribution.moreInfoBriefOrLong', null, 1) }}
        </nuxt-link>
      </li>
      <li :class="{ 'is-active': isCurrentPage(`/contributions/take-action/`) }">
        <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }">
          3. {{ $t('component.contribution.takeAction') }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    name: 'hc-contribution-bread-crumb',
    props: {
      contribution: {
        required: true,
        type: Object
      }
    },
    methods: {
      isCurrentPage (searchInPath) {
        return this.$route.path.indexOf(searchInPath) >= 0
      }
    }
  }
</script>

<style scoped lang="scss">
  .is-active {
    font-weight: bold;
  }
  nav.breadcrumb {
    ul {
      margin-left: 0 !important;
      margin-top: 0 !important;
      align-items: center;
    }
  }
</style>
