<template>
  <section id="page-auth-reset" class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <hc-flag-switch />
        <div class="card-teaser">
          <nuxt-link :to="$route.params.path || '/'">
            <img src="/assets/images/registration/humanconnection.svg" alt="Human Connection"/>
          </nuxt-link>
        </div>
        <transition name="slide-up">
          <div v-if="!success" key="step1">
            <p class="subtitle is-6">{{ $t('auth.login.passwordResetDescription') }}</p>
            <form @submit.prevent="reset">
              <div class="field">
                <div class="control has-icons-left has-icons-right" :class="{ 'has-error': $v.form.email.$error }">
                  <label class="is-hidden" for="form-email">{{ $t('auth.account.email') }}</label>
                  <input v-focus
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
                  <p :class="{ 'is-hidden': !$v.form.email.$error }" class="help is-danger">{{ $t('auth.login.validationErrorEmail') }}</p>
                </div>
              </div>
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
          <div v-else key="step2">
            <p class="subtitle is-6">{{ $t('auth.login.passwordResetRequestSuccess') }}</p>
          </div>
        </transition>
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
          email: ''
        },
        isLoading: false,
        success: false
      }
    },
    validations () {
      return {
        form: {
          email: {
            required,
            email
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
        this.$store.dispatch('auth/resetPassword', this.form)
          .then(() => {
            // this.$snackbar.open({
            //   message: this.$t('auth.login.passwordResetRequestSuccess'),
            //   duration: 8000,
            //   type: 'is-success'
            // })
            this.success = true
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
            this.$toast.open({
              message: this.$t('auth.login.passwordResetRequestError'),
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
