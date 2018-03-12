<template>
  <div>
    <hc-frame>
      <div class="container" id="main">
        <section class="hero is-primary">
          <div class="hero-body">
            <h1 class="title">
              Administration
            </h1>
          </div>
        </section>
        <div class="columns">
          <div class="column is-one-quarter-tablet">
            <hc-admin-menu />
          </div>
          <div class="column">
            <div class="admin-content">
              <nuxt/>
            </div>
          </div>
        </div>
      </div>
      <hc-footer/>
    </hc-frame>
  </div>
</template>

<script>
  import HcFooter from '~/components/layout/Footer.vue'
  import HcFrame from '~/components/layout/Frame.vue'
  import HcAdminMenu from '~/components/Admin/AdminMenu.vue'

  export default {
    components: {
      HcFooter,
      HcFrame,
      HcAdminMenu
    },
    async mounted () {
      // refresh token to fix refresh issues
      await this.$store.dispatch('auth/refreshJWT', 'layout admin')
    }
  }
</script>

<style lang="scss" scoped>
  @import 'assets/styles/utilities';

  .hero {
    margin-bottom:30px;
  }
  .hero-body {
    padding: 2rem 1.5rem;
  }
  .admin-content {
    background-color: $white;
    padding: 2rem 1.5rem;
  }
</style>
