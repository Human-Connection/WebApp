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
          <div class="field">
            <div class="control has-icons-right">
              <input :class="{ 'input': true, 'is-danger': $v.form.password.$error }" 
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
          <div class="field" v-if="useInviteCode">
            <div class="control has-icons-right">
              <input :class="{ 'input': true, 'is-danger': $v.form.inviteCode.$error }" 
                     type="text" 
                     :placeholder="$t('auth.account.inviteCode')"
                     v-model.trim="form.inviteCode"
                     @blur="$v.form.inviteCode.$touch">
              <span v-if="$v.form.inviteCode.$error" class="icon is-small is-right">
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
                     size="medium" 
                     type="button" 
                     class="is-fullwidth" 
                     :isLoading="isLoading" 
                     :disabled="$v.form.$invalid">
            {{ $t('auth.register.label') }}
          </hc-button>
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
  import { validationMixin } from 'vuelidate'
  import { required, email, minLength } from 'vuelidate/lib/validators'

  export default {
    middleware: 'anonymous',
    layout: 'blank',
    mixins: [animatable, validationMixin],
    data () {
      return {
        form: {
          email: '',
          password: '',
          inviteCode: '',
          isFullAge: false
        },
        isLoading: false,
        useInviteCode: false
      }
    },
    validations () {
      let rules = {
        form: {
          email: {
            required,
            email
          },
          password: {
            required,
            minLength: minLength(6)
          },
          isFullAge: {
            required
          }
        }
      }
      if (this.useInviteCode) {
        rules.form.inviteCode = {
          required,
          minLength: minLength(6)
        }
      }

      return rules
    },
    mounted () {
      Vue.nextTick(() => {
        this.$refs['focus'].focus()
      })
    },
    methods: {
      async register (e) {
        if (this.$v.form.$invalid) {
          // this.errors = true
          this.animate('shake')
          this.isLoading = false
          return
        }

        e.preventDefault()
        // this.errors = false
        this.isLoading = true
        this.$store.dispatch('auth/register', this.form)
          .then(() => {
            this.isLoading = false
            this.form.password = null
            this.$router.replace({name: 'auth-name'})
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            // this.errors = true
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
