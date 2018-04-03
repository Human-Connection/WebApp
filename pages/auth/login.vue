<template>
  <section id="page-auth-login" class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <hc-flag-switch />
        <nuxt-link v-if="false"
                   :to="$route.params.path || '/'"
                   class="delete"
                   style="display: block; position: absolute; right: 1.5rem; top: 1rem;"></nuxt-link>
        <div class="card-teaser">
          <nuxt-link :to="$route.params.path || '/'">
            <img src="/assets/images/registration/humanconnection.svg" alt="Human Connection"/>
          </nuxt-link>
        </div>
        <p class="subtitle is-6">{{ $t('auth.login.description') }}</p>
        <form @submit.prevent="login">
          <div class="field">
            <div class="control has-icons-left has-icons-right" :class="{ 'has-error': $v.form.email.$error }">
              <label class="is-hidden" for="form-email">{{ $t('auth.account.email') }}</label>
              <input ref="focus"
                     id="form-email"
                     name="email"
                     type="email"
                     autofocus
                     :class="{ 'input': true, 'is-danger': $v.form.email.$error }"
                     :placeholder="$t('auth.account.email')"
                     v-model.trim="form.email"
                     @blur="$v.form.email.$touch()">
              <span class="icon is-small is-left">
                <i class="fa fa-envelope"></i>
              </span>
              <span v-if="$v.form.email.$error" class="icon is-small is-right">
                <i class="fa fa-warning"></i>
              </span>
              <p v-if="$v.form.email.$error" class="help is-danger">{{ $t('auth.login.validationErrorEmail') }}</p>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right" :class="{ 'has-error': $v.form.password.$error }">
              <label class="is-hidden" for="form-password">{{ $t('auth.account.password') }}</label>
              <input :class="{ 'input': true, 'is-danger': $v.form.password.$error }"
                     id="form-password"
                     name="password"
                     type="password"
                     :placeholder="$t('auth.account.password')"
                     v-model="form.password"
                     @blur="$v.form.password.$touch()">
              <span class="icon is-left">
                <i class="fa fa-lock"></i>
              </span>
              <span v-if="$v.form.password.$error" class="icon is-small is-right">
                <i class="fa fa-warning"></i>
              </span>
              <p v-if="$v.form.password.$error" class="help is-danger">{{ $t('auth.login.validationErrorPassword') }}</p>
            </div>
          </div>
          <div class="field has-text-left is-hidden">
            <b-switch v-model="stayLoggedIn">{{ $t('auth.login.stayLoggedIn') }}</b-switch>
          </div>
          <hc-button color="primary"
                     name="submit"
                     @click.prevent="login"
                     size="medium"
                     type="button"
                     class="is-fullwidth"
                     :isLoading="isLoading">
            {{ $t('auth.login.label') }}
          </hc-button>
        </form>
      </div>
      <footer class="card-footer is-hidden">
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
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'
  import FlagSwitch from '~/components/Auth/FlagSwitch'

  export default {
    middleware: 'anonymous',
    layout: 'blank',
    mixins: [animatable, validationMixin],
    components: {
      'hc-flag-switch': FlagSwitch
    },
    data () {
      return {
        form: {
          email: '',
          password: ''
        },
        isLoading: false,
        stayLoggedIn: false
      }
    },
    validations () {
      return {
        form: {
          email: {
            required,
            email
          },
          password: {
            required
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    mounted () {
      this.$nextTick(() => {
        try {
          this.$refs['focus'].focus()
        } catch (err) {}

        if (this.$route.params.path || this.$route.query.path) {
          this.$snackbar.open({
            message: this.$t('auth.login.forbidden'),
            type: 'is-danger'
          })
        }
      })
    },
    methods: {
      login () {
        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.animate('shake')
          this.isLoading = false
          this.$toast.open({
            message: this.$t('auth.login.validationError'),
            type: 'is-danger'
          })
          return
        }
        this.isLoading = true
        this.$store.dispatch('auth/login', this.form)
          .then(() => {
            this.$snackbar.open({
              message: this.$t('auth.login.successInfo'),
              duration: 4000,
              type: 'is-success'
            })
            this.$router.replace(this.$route.params.path || this.$route.query.path || '/')
          })
          .catch(() => {
            this.isLoading = false
            this.$toast.open({
              message: this.$t('auth.login.errorInvalid'),
              type: 'is-danger'
            })
            this.animate('shake')
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
    padding-top: 30px;
  }

  .card-teaser {
    img {
      display: inline-block;
      height: 140px;

      @include tablet {
        max-width: 240px;
        height: auto;
      }
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
