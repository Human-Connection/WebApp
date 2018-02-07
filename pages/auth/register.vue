<template>
  <section class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <hc-flag-switch />
        <nuxt-link v-if="!useInviteCode"
                   :to="$route.params.path || '/'"
                   class="delete"
                   style="display: block; position: absolute; right: 1.5rem; top: 1rem;"></nuxt-link>
        <div class="card-teaser">
          <nuxt-link :to="$route.params.path || '/'">
            <img src="/assets/images/registration/alpha-invite.png"
                 srcset="/assets/images/registration/alpha-invite.png 1x, /assets/images/registration/alpha-invite2x.png 2x"
                 alt="Human Connection"/>
          </nuxt-link>
        </div>
        <p class="subtitle is-6">{{ $t('auth.register.description') }}</p>
        <form @submit.prevent="register">
          <template v-if="step === 1">
            <div class="field">
              <div class="control has-icons-right">
                <input ref="focus" 
                      autofocus 
                      :class="{ 'input': true, 'is-danger': $v.form.email.$error }" 
                      type="email"
                      :placeholder="$t('auth.account.email')" 
                      v-model.trim="form.email"
                      @blur="$v.form.email.$touch">
                <span v-if="$v.form.email.$error" class="icon is-small is-right">
                  <i class="fa fa-warning"></i>
                </span>
              </div>
            </div>
            <div class="field" v-if="useInviteCode">
              <div class="control has-icons-right">
                <input :class="{ 'input': true, 'is-danger': $v.form.inviteCode.$error || inviteCodeIsInvalid }" 
                      type="text" 
                      maxlength="8"
                      :placeholder="$t('auth.account.inviteCode')"
                      v-model.trim="form.inviteCode"
                      @keyup="inviteCodeIsInvalid = false"
                      @blur="$v.form.inviteCode.$touch">
                <span v-if="$v.form.inviteCode.$error || inviteCodeIsInvalid" class="icon is-small is-right">
                  <i class="fa fa-warning"></i>
                </span>
              </div>
            </div>
            <div class="field has-text-le">
              <b-checkbox v-model="form.isFullAge"
                          :class="{'is-danger': $v.form.isFullAge.$error }">
                {{ $t('auth.account.confirmOlderThan18') }}
              </b-checkbox>
            </div>
            <hc-button color="primary"
                       @click.prevent="toStep(2)"
                       size="medium" 
                       type="button" 
                       class="is-fullwidth" 
                       :disabled="$v.form.$invalid || inviteCodeIsInvalid">
              {{ $t('auth.register.next') }} &nbsp;<small><i class="fa fa-arrow-right"></i></small>
            </hc-button>
          </template>
          <template v-if="step === 2">
            <div class="field">
              <div class="control has-icons-right">
                <input :class="{ 'input': true, 'is-danger': $v.form.password.$error }" 
                      ref="focus" 
                      autofocus 
                      type="password" 
                      :placeholder="$t('auth.account.password')"
                      v-model.trim="form.password" 
                      autocomplete="new-password"
                      @blur="$v.form.password.$touch">
                <span v-if="$v.form.password.$error" class="icon is-small is-right">
                  <i class="fa fa-warning"></i>
                </span>
              </div>
            </div>
            <div class="field">
              <div class="control has-icons-right">
                <input :class="{ 'input': true, 'is-danger': $v.form.passwordRepeat.$error }" 
                      type="password" 
                      :placeholder="$t('auth.account.password')"
                      v-model.trim="form.passwordRepeat" 
                      autocomplete="new-password"
                      @blur="$v.form.passwordRepeat.$touch">
                <span v-if="$v.form.passwordRepeat.$error" class="icon is-small is-right">
                  <i class="fa fa-warning"></i>
                </span>
              </div>
            </div>
            <hc-button @click.prevent="register"
                       color="primary"
                       size="medium" 
                       type="button" 
                       class="is-fullwidth" 
                       :isLoading="isLoading" 
                       :disabled="$v.form.$invalid">
              {{ $t('auth.register.label') }}
            </hc-button>
            <a @click.prevent="toStep(1)"><i class="fa fa-arrow-left"></i> &nbsp;{{ $t('auth.register.back') }}</a>
          </template>
        </form>
        <p class="small-info" v-html="$t('auth.account.confirmTermsOfUsage', {
            'termsOfService': $t('legal.termsOfService'),
            'dataPrivacyStatement': $t('legal.dataPrivacyStatement'),
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
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
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
          email: this.$route.query.email || '',
          password: '',
          passwordRepeat: '',
          inviteCode: this.$route.query.code || '',
          isFullAge: false
        },
        step: 1,
        inviteCodeIsInvalid: false,
        isLoading: false,
        useInviteCode: true
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
        this.toStep(1)

        this.form.email = this.$route.query.email || ''
        this.form.inviteCode = this.$route.query.code || ''
      })
    },
    methods: {
      toStep (s) {
        this.step = s
        this.$refs['focus'].focus()
      },
      register () {
        if (this.$v.form.$invalid) {
          this.animate('shake')
          this.isLoading = false
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
            }
            this.$toast.open({
              message: msg,
              duration: 3000,
              type: 'is-danger'
            })
            this.animate('shake')
            this.isLoading = false
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
      margin-top: 2rem;
      //max-width: 200px;
      height: auto;

      @include tablet {
        // max-width: 260px;
      }
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
