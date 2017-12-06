<template>
  <section class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <nuxt-link :to="this.$route.params.path || '/'" class="delete" style="display: block; position: absolute; right: 2.5rem; top: 2rem;"></nuxt-link>
        <div class="card-teaser">
          <nuxt-link :to="this.$route.params.path || '/'">
            <img src="/assets/images/registration/humanconnection.svg" alt="Human Connection"/>
          </nuxt-link>
        </div>
        <p class="subtitle is-6">{{ $t('auth.register.description') }}</p>
        <form @submit.prevent="register">
          <div class="field">
            <p class="control has-icons-right">
              <input ref="focus" class="input" autofocus v-bind:class="{ 'is-danger': errors }" type="email"
                     v-bind:placeholder="$t('auth.account.email')" v-model="data.email">
              <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-right">
              <input class="input" v-bind:class="{ 'is-danger': errors }" type="password" v-bind:placeholder="$t('auth.account.password')"
                     v-model="data.password" autocomplete="new-password">
              <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <div class="field has-text-le">
            <b-checkbox>{{ $t('auth.account.confirmOlderThan18') }}</b-checkbox>
          </div>
          <p>
            <hc-button color="primary" size="medium" type="button" class="is-fullwidth" :loading="loading">
              {{ $t('auth.register.label') }}
            </hc-button>
          </p>
        </form>
        <!-- TODO links by named route not hard coded -->
        <p class="small-info" v-html="$t('auth.account.confirmTermsOfUsage', {
            'termsOfService': $t('legal.termsOfService'),
            'dataPrivacyStatement': $t('legal.termsOfService'),
            'url': '/legal'
          })"></p>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-login', params: { path: this.$route.params.path } }" class="card-footer-item">
          {{ $t('auth.register.accountAlready') }}
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import animatable from '~/components/mixins/animatable'

  export default {
    middleware: 'anonymous',
    layout: 'blank',
    mixins: [animatable],
    data () {
      return {
        data: {
          email: '',
          password: ''
        },
        loading: false,
        errors: null
      }
    },
    mounted () {
      Vue.nextTick(() => {
        this.$refs['focus'].focus()
      })
    },
    methods: {
      async register (e) {
        e.preventDefault()
        this.errors = false
        this.loading = true
        this.$store.dispatch('auth/register', this.data)
          .then(() => {
            this.loading = false
            this.data.password = null
            this.$router.replace({name: 'auth-name'})
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            this.errors = true
            this.animate('shake')
            this.loading = false
          })
      }
    },
    head () {
      return {
        title: this.$t('auth.register.label')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";
  @import "assets/styles/_animations";

  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
    border: none;
    box-shadow: $card-shadow;
  }

  .subtitle {
    margin-top: 30px;
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

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
