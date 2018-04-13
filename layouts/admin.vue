<template>
  <div :id="id" class="admin-container">
    <hc-frame>
      <div class="container" id="main">
        <section class="hero">
          <h2 class="title is-2">
            Administration
          </h2>
        </section>
        <div class="columns">
          <div class="column is-one-quarter-tablet ">
            <hc-admin-menu />
          </div>
          <div class="column">
            <transition name="slide-up" appear>
              <nuxt class="admin-content"/>
            </transition>
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
    },
    computed: {
      id () {
        return `page-name-${this.$route.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'assets/styles/utilities';

  .hero {
    margin-bottom: 30px;
  }
  .hero-body {
    padding: 2rem 1.5rem;
  }
  .admin-content {
    box-shadow: $card-shadow;
    background-color: $white;
    padding: 2rem 1.5rem;
  }

  .admin-container {
    padding-bottom: 3rem;
  }
</style>
