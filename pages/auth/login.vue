<template>
  <section class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <nuxt-link :to="this.$route.params.path || '/'" class="delete" style="display: block; position: absolute; right: 2.5rem; top: 2rem;"></nuxt-link>
        <div class="card-teaser">
          <nuxt-link :to="this.$route.params.path || '/'">
            <img src="/logo-vertical.svg" alt="Human Connection" class="logo"/>
          </nuxt-link>
        </div>
        <p class="subtitle is-6">{{ $t('auth.login.description') }}</p>
        <form @submit.prevent="login">
          <div class="field">
            <p class="control has-icons-right">
              <input ref="focus" class="input" autofocus v-bind:class="{ 'is-danger': errors }" type="email"
                     name="username" v-bind:placeholder="$t('auth.account.email')" v-model="data.email">
              <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-right">
              <input class="input" v-bind:class="{ 'is-danger': errors }" type="password" v-bind:placeholder="$t('auth.account.password')"
                     name="password" v-model="data.password">
              <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <div class="field has-text-left">
            <b-switch v-model="stayLoggedIn">{{ $t('auth.login.stayLoggedIn') }}</b-switch>
          </div>
          <hc-button color="primary"
                     name="submit"
                     size="medium"
                     type="button"
                     class="is-fullwidth"
                     :loading="loading">
            {{ $t('auth.login.label') }}
          </hc-button>
        </form>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-register', params: { path: this.$route.params.path } }" class="card-footer-item">
          {{ $t('auth.register.noAccountYet') }}
        </nuxt-link>
        <a href="#" style="cursor: not-allowed" class="card-footer-item is-disabled disabled">
          {{ $t('auth.login.forgotPassword') }}
        </a>
      </footer>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
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
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    mounted () {
      Vue.nextTick(() => {
        this.$refs['focus'].focus()
      })
    },
    methods: {
      async login (e) {
        e.preventDefault()
        this.errors = false
        this.loading = true
        this.$store.dispatch('auth/login', this.data)
          .then(() => {
            this.$snackbar.open({
              message: this.$t('auth.login.successInfo'),
              duration: 4000,
              type: 'is-success'
            })
            this.data.password = null
            this.$router.replace(this.$route.params.path || this.$route.query.path || '/')
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
        title: this.$t('auth.login.label')
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
    padding-top: 10px;

    img {
      display: inline-block;
      max-width: 200px;
      height: auto;
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
