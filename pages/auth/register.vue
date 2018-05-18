<template>
  <section class="container">
    <div class="card content" :class="classes">
      <div class="card-content">
        <hc-flag-switch />
        <!--<nuxt-link v-if="!useInviteCode"
                   :to="$route.params.path || '/'"
                   class="delete"
                   style="display: block; position: absolute; right: 1.5rem; top: 1rem;"></nuxt-link>-->
        <form @submit.prevent="register">
          <transition :name="transitionName">
            <div key="step0" v-if="step === 0">
              <div class="card-teaser" style="margin-top: -3rem;">
                <!--<nuxt-link :to="$route.params.path || '/'">-->
                <img src="/assets/images/registration/alpha-invite.png"
                      srcset="/assets/images/registration/alpha-invite.png 1x, /assets/images/registration/alpha-invite2x.png 2x"
                      alt="Human Connection"/>
                <!--</nuxt-link>-->
              </div>
              <br />
              <p>{{ $t('auth.register.description') }}</p>
              <hc-button color="primary"
                        @click.prevent="toStep(1)"
                        size="medium"
                        type="button"
                        class="is-fullwidth">
                {{ $t('auth.register.next') }} &nbsp;<small><i class="fa fa-arrow-right"></i></small>
              </hc-button>
            </div>
            <div key="step1" v-if="step === 1">
              <p class="help">{{ $t('auth.register.descriptionStep1') }}</p>
              <div class="field">
                <div class="control has-icons-left has-icons-right"
                    :class="{ 'has-error': $v.form.email.$error }">
                    <label class="is-hidden" for="form-email">{{ $t('auth.account.email') }}</label>
                  <input v-focus
                         autofocus
                         id="form-email"
                         :class="{ 'input': true, 'is-danger': $v.form.email.$error }"
                         type="email"
                         :placeholder="$t('auth.account.email')"
                         v-model.trim="form.email"
                         @blur="$v.form.email.$touch()">
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                  <span v-if="$v.form.email.$error" class="icon is-small is-right">
                    <i class="fa fa-warning"></i>
                  </span>
                </div>
                <p :class="{ 'is-hidden': !$v.form.email.$error }" class="help is-danger">{{ $t('auth.login.validationErrorEmail') }}</p>
              </div>
              <div class="field" v-if="useInviteCode">
                <div class="control has-icons-left has-icons-right"
                    :class="{ 'has-error': $v.form.inviteCode.$error || inviteCodeIsInvalid }">
                    <label class="is-hidden" for="form-inviteCode">{{ $t('auth.account.inviteCode') }}</label>
                  <input :class="{ 'input': true, 'is-danger': $v.form.inviteCode.$error || inviteCodeIsInvalid }"
                        type="text"
                        id="form-inviteCode"
                        maxlength="8"
                        :placeholder="$t('auth.account.inviteCode')"
                        v-model.trim="form.inviteCode"
                        @keyup="inviteCodeIsInvalid = false"
                        @blur="$v.form.inviteCode.$touch()">
                  <span class="icon is-small is-left">
                    <i class="fa fa-barcode"></i>
                  </span>
                  <span v-if="$v.form.inviteCode.$error || inviteCodeIsInvalid" class="icon is-small is-right">
                    <i class="fa fa-warning"></i>
                  </span>
                </div>
                <p :class="{ 'is-hidden': !$v.form.inviteCode.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
                <p :class="{ 'is-hidden': !inviteCodeIsInvalid }" class="help is-danger">{{ $t('auth.register.errorInviteCodeInvalid') }}</p>
              </div>
              <div class="field has-text-le">
                <b-checkbox v-model="form.isFullAge"
                            @change="$v.form.isFullAge.$touch()"
                            class="is-required"
                            :class="{'has-error': $v.form.isFullAge.$error }">
                  {{ $t('auth.account.confirmOlderThan18') }}
                </b-checkbox>
                <p :class="{ 'is-hidden': !$v.form.isFullAge.$error }" class="help is-danger">{{ $t('auth.register.validationErrorIsFullAge') }}</p>
              </div>
              <hc-button color="primary"
                        @click.prevent="toStep(2)"
                        size="medium"
                        type="button"
                        class="is-fullwidth">
                {{ $t('auth.register.next') }} &nbsp;<small><i class="fa fa-arrow-right"></i></small>
              </hc-button>
            </div>
            <div key="step2" v-if="step === 2">
              <p class="help">{{ $t('auth.register.descriptionStep2') }}</p>
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
                        @blur="form.password ? $v.form.password.$touch() : null">
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                  <span v-if="$v.form.password.$error || ($v.form.password.$dirty && !passwordSecure)" class="icon is-small is-right">
                    <i class="fa fa-warning"></i>
                  </span>
                </div>
                <p :class="{ 'is-hidden': !$v.form.password.$error }" class="help is-danger">{{ $t('auth.validation.errorPassword') }}</p>
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
                  <p :class="{ 'is-hidden': !$v.form.passwordRepeat.$error }" class="help is-danger">{{ $t('auth.register.validationErrorPasswordRepeat') }}</p>
                </div>
              </div>
              <password-meter :password="form.password"
                              @change="e => passwordSecure = e.isSecure" />
              <hc-button @click.prevent="register"
                        color="primary"
                        size="medium"
                        type="button"
                        class="is-fullwidth"
                        :isLoading="isLoading">
                <i class="fa fa-check"></i>&nbsp;
                {{ $t('auth.register.label') }}
              </hc-button>
              <a @click.prevent="toStep(1)"><i class="fa fa-arrow-left"></i> &nbsp;{{ $t('auth.register.back') }}</a>
              <p @click="openLegalInfo" class="small-info" style="margin-top: 2rem;" v-html="$t('auth.account.confirmTermsOfUsage', {
                  'termsOfService': linkTermsOfService,
                  'dataPrivacyStatement': linkPrivacyPolicy,
                  'url': '/legal'
                })"></p>
            </div>
          </transition>
        </form>
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
  import animatable from '~/components/mixins/animatable'
  import { isEmpty } from 'lodash'
  import { validationMixin } from 'vuelidate'
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
  import FlagSwitch from '~/components/Auth/FlagSwitch'
  import PasswordMeter from '~/components/Auth/PasswordMeter'
  import { mapMutations } from 'vuex';

  export default {
    middleware: 'anonymous',
    layout: 'blank',
    mixins: [animatable, validationMixin],
    components: {
      'hc-flag-switch': FlagSwitch,
      PasswordMeter
    },
    data () {
      return {
        form: {
          email: this.$route.query.email || '',
          password: '',
          passwordRepeat: '',
          inviteCode: this.$route.query.code || '',
          isFullAge: false
        },
        step: 0,
        inviteCodeIsInvalid: false,
        isLoading: false,
        useInviteCode: true,
        passwordSecure: false,
        transitionName: 'slide-next'
      }
    },
    validations () {
      let rules = {}
      if (this.step === 1) {
        rules = {
          form: {
            email: {
              required,
              email
            },
            isFullAge: {
              required
            }
          }
        }
        if (this.useInviteCode) {
          rules.form.inviteCode = {
            required,
            minLength: minLength(8)
          }
        }
      } else {
        rules = {
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
      }
      return rules
    },
    mounted () {
      this.$nextTick(() => {
        this.toStep(0)

        if (this.$route.query.lang && isEmpty(this.$cookies.get('locale'))) {
          // console.log('LANG: ' + this.$route.query.lang)
          this.$i18n.set(this.$route.query.lang)
        }
      })
    },
    methods: {
      openLegalInfo (e) {
        if (e.metaKey || e.ctrlKey) {
          return
        }
        switch (e.target.getAttribute('data-page')) {
          case 'privacy-policy':
            e.preventDefault()
            this.$openInModal({slug: 'privacy-policy'})
            break;
          case 'terms-and-conditions':
            e.preventDefault()
            this.$openInModal({slug: 'terms-and-conditions'})
            break;
        }
      },
      resetRouteHash () {
        this.$nextTick(() => {
          this.$router.replace(this.$route.fullPath.split('#').shift())
        })
      },
      toStep (step) {
        if (step === 1 && this.step === 0) {
          this.form.email = this.$route.query.email || ''
          this.form.inviteCode = this.$route.query.code || ''
        }

        this.transitionName = (step > this.step) ? 'slide-next' : 'slide-prev'

        if (step === 2 && this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.animate('shake')
          this.$toast.open({
            message: this.$t('auth.validation.error'),
            type: 'is-danger'
          })
          return false
        }

        this.step = step
      },
      register () {
        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.animate('shake')
          this.isLoading = false
          this.$toast.open({
            message: this.$t('auth.validation.error'),
            type: 'is-danger'
          })
          return
        }
        this.isLoading = true
        this.$store.dispatch('auth/register', this.form)
          .then(() => {
            this.form.password = null
            this.$router.replace({name: 'auth-name'})
          })
          .catch(err => {
            this.isLoading = false
            let msg = err.message
            if (msg === 'invite code is invalid') {
              this.toStep(1)
              this.inviteCodeIsInvalid = true
              msg = this.$t('auth.register.errorInviteCodeInvalid')
            }
            this.$toast.open({
              message: msg,
              type: 'is-danger'
            })
            this.animate('shake')
            this.isLoading = false
          })
      }
    },
    computed: {
      linkPrivacyPolicy () {
        return `<a data-page="privacy-policy" href="/pages/privacy-policy" target="_blank">${this.$t('legal.privacyPolicy')}</a>`
      },
      linkTermsOfService () {
        return `<a data-page="terms-and-conditions" href="/pages/terms-and-conditions" target="_blank">${this.$t('legal.dataPrivacyStatement')}</a>`
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
    // overflow-x: hidden;
  }

  .subtitle {
    margin-top: 15px;

    @include tablet {
      margin-top: 30px;
    }
  }

  .card-teaser {
    img {
      display: inline-block;

      @include tablet {
        height: auto;
        margin-top: 2rem;
      }
    }
  }

  .small-info a {
    font-weight: bold !important;
  }

  form {
    margin: 1em auto 0;
    padding: 1em;
    text-align: left;

    transition: all 250ms;
  }
</style>
