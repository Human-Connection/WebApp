<template>
  <section class="container content">
    <div class="card">
      <div class="card-content">
        <div class="card-teaser">
          <img src="/assets/images/registration/onourjourney.svg" alt="Human Connection"/>
        </div>
        <h1 class="title is-3 is-spaced">{{ $t('auth.account.welcomeSection') }}</h1>
        <p class="subtitle is-6" v-html="$t(
          'auth.account.welcomeGreeting1',
          {'username': user && user.name ? ', <span>' + user.name + '</span>' : '' }
        )">
        </p>
        <p class="subtitle is-4">{{ $t('auth.account.welcomeGreeting2') }}</p>
        <p class="button-container">
          <hc-button to="/" color="primary" size="medium" type="nuxt" class="is-fullwidth">
            {{ $t('button.getStarted') }}
          </hc-button>
        </p>
      </div>
      <footer class="card-footer">
        <nuxt-link to="/" class="card-footer-item">
          {{ $t('button.skip') }}
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    layout: 'blank',
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    head () {
      return {
        title: this.$t('auth.account.welcomeTitle')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";

  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
    border: none;
    box-shadow: $card-shadow;
  }

  .card-teaser {
    img {
      display: inline-block;
      max-width: 200px;
      height: auto;

      @include tablet {
        max-width: 260px;
      }
    }
  }

  .button-container {
    padding: 1em;
    margin: 1em auto;
  }
</style>
