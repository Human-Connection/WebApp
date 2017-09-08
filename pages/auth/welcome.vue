<template>
  <section class="container content">
    <div class="card">
      <div class="card-content">
        <div class="card-teaser">
          <img src="/assets/images/registration/onourjourney.svg" alt="Human Connection"/>
        </div>
        <h1 class="title is-3 is-spaced">Die Reise beginnt</h1>
        <p class="subtitle is-6">Schön dich an Bord zu haben<span v-if="user.name">, {{user.name}}</span>! Herzlich Willkommen bei Human Connection. Wir wünschen dir viel Spaß beim entdecken und aktiv werden.
        </p>
        <p class="subtitle is-4">Begeben wir uns auf die Reise in eine gemeinsame Zukunft!</p>
        <p class="button-container">
          <hc-button to="/" color="primary" size="medium" type="nuxt" class="is-fullwidth">
            Loslegen
          </hc-button>
        </p>
      </div>
      <footer class="card-footer">
        <nuxt-link to="/" class="card-footer-item">
          Überspringen
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    middleware: 'authenticated',
    layout: 'blank',
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    head () {
      return {
        title: 'Welcome'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
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
