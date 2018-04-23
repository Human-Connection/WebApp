<template>
  <section id="page-auth-reset" class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <hc-flag-switch/>
        <div class="card-teaser">
          <nuxt-link :to="$route.params.path || '/'">
            <img src="/assets/images/registration/humanconnection.svg" alt="Human Connection"/>
          </nuxt-link>
        </div>
        <p class="subtitle is-6">{{ $t('auth.login.passwordResetDescription') }}</p>
        <form @submit.prevent="reset">
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <label class="is-hidden" for="form-password">{{ $t('auth.account.password') }}</label>
              <input :class="{ 'input': true, 'is-danger': $v.form.password.$error }"
                     v-focus
                     id="form-password"
                     autofocus
                     type="password"
                     :placeholder="$t('auth.account.password')"
                     v-model="form.password"
                     autocomplete="new-password"
                     @blur="$v.form.password.$touch()">
              <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
              <span v-if="$v.form.password.$error || ($v.form.password.$dirty && !passwordSecure)"
                    class="icon is-small is-right">
                    <i class="fa fa-warning"></i>
                  </span>
            </div>
            <p :class="{ 'is-hidden': !$v.form.password.$error }" class="help is-danger">
              {{ $t('auth.validation.errorPassword') }}</p>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <label class="is-hidden" for="form-passwordRepeat">{{ $t('auth.account.passwordRepeat') }}</label>
              <input :class="{ 'input': true, 'is-danger': $v.form.passwordRepeat.$error }"
                     type="password"
                     id="form-passwordRepeat"
                     :placeholder="$t('auth.account.password')"
                     v-model="form.passwordRepeat"
                     autocomplete="new-password"
                     @blur="$v.form.passwordRepeat.$touch()">
              <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
              <span v-if="$v.form.passwordRepeat.$error" class="icon is-small is-right">
                    <i class="fa fa-warning"></i>
                  </span>
              <p :class="{ 'is-hidden': !$v.form.passwordRepeat.$error }" class="help is-danger">
                {{ $t('auth.register.validationErrorPasswordRepeat') }}</p>
            </div>
          </div>
          <password-meter :password="form.password"
                          @change="e => passwordSecure = e.isSecure"/>
          <hc-button color="primary"
                     name="submit"
                     @click.prevent="reset"
                     size="medium"
                     type="button"
                     class="is-fullwidth"
                     :isLoading="isLoading">
            {{ $t('auth.login.resetPassword') }}
          </hc-button>
        </form>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-login' }" class="card-footer-item is-disabled disabled">
          {{ $t('auth.login.backToLogin') }}
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import animatable from '~/components/mixins/animatable'
  import {validationMixin} from 'vuelidate'
  import {required, minLength, sameAs} from 'vuelidate/lib/validators'
  import FlagSwitch from '~/components/Auth/FlagSwitch'
  import PasswordMeter from '~/components/Auth/PasswordMeter'

  export default {
    middleware: 'anonymous',
    layout: 'blank',
    mixins: [animatable, validationMixin],
    components: {
      'hc-flag-switch': FlagSwitch,
      PasswordMeter
    },
    asyncData ({ params }) {
      return { token: params.token }
    },
    data () {
      return {
        form: {
          password: '',
          passwordRepeat: ''
        },
        isLoading: false,
        passwordSecure: false
      }
    },
    validations () {
      return {
        form: {
          password: {
            required,
            minLength: minLength(6)
          },
          passwordRepeat: {
            sameAsPassword: sameAs('password')
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.$route.params.path || this.$route.query.path) {
          this.$snackbar.open({
            message: this.$t('auth.login.forbidden'),
            type: 'is-danger'
          })
        }
      })
    },
    methods: {
      reset () {
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
        console.log(this.token)
        const data = {
          token: this.token,
          password: this.form.password
        }
        this.$store.dispatch('auth/setNewPassword', data)
          .then(() => {
            this.$snackbar.open({
              message: this.$t('auth.login.passwordResetSuccess'),
              duration: 4000,
              type: 'is-success'
            })
            this.$router.replace('/login')
          })
          .catch(() => {
            this.isLoading = false
            this.$toast.open({
              message: this.$t('auth.login.passwordResetError'),
              type: 'is-danger'
            })
            this.animate('shake')
            this.isLoading = false
          })
      }
    },
    head () {
      return {
        title: this.$t('auth.login.resetPassword')
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
