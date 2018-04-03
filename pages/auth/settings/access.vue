<template>
  <div class="security fullwidth-box" :class="classes">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.securityWelcome') }}
      </h2>
      <p>{{ $t('auth.settings.securityWelcomeText') }}</p>
    </div>
    <hr>
    <h3 class="title is-4">{{ $t('auth.settings.changePassword') }}</h3>
    <div class="columns">
      <div class="column">
        <div class="field"
             :class="{ 'has-error': $v.form.passwordOld.$error || currentPasswortInvalid }">
          <label class="label is-required">{{ $t('auth.settings.currentPassword') }}</label>
          <div class="control has-icons-right">
            <input v-model="form.passwordOld"
                   type="password"
                   class="input"
                   @blur="$v.form.passwordOld.$touch(); currentPasswortInvalid = false">
            <span v-if="$v.form.passwordOld.$error || currentPasswortInvalid" class="icon is-small is-right">
              <i class="fa fa-warning"></i>
            </span>
          </div>
          <p v-if="$v.form.passwordOld.$error || currentPasswortInvalid" class="help is-danger">{{ $t('auth.validation.error') }}</p>
        </div>
      </div>
      <div class="column">
        <div class="field"
             :class="{ 'has-error': $v.form.passwordNew.$error }">
          <label class="label is-required">{{ $t('auth.settings.newPassword') }}</label>
          <div class="control has-icons-right">
            <input v-model="form.passwordNew"
                   type="password"
                   class="input"
                   @blur="$v.form.passwordNew.$touch()">
            <span v-if="$v.form.passwordNew.$error" class="icon is-small is-right">
              <i class="fa fa-warning"></i>
            </span>
          </div>
          <p v-if="$v.form.passwordNew.$error && !$v.form.passwordNew.required" class="help is-danger">{{ $t('auth.validation.error') }}</p>
          <p v-else-if="$v.form.passwordNew.$error && !$v.form.passwordNew.minLength" class="help is-danger">{{ $t('auth.validation.errorMinLength', { minLength: 8 }) }}</p>
        </div>
        <div class="field"
            :class="{ 'has-error': $v.form.passwordNewConfirm.$error }">
          <label class="label is-required">{{ $t('auth.settings.newPasswordConfirm') }}</label>
          <div class="control has-icons-right">
            <input v-model="form.passwordNewConfirm"
                   type="password"
                   class="input"
                   @blur="$v.form.passwordNewConfirm.$touch()">
            <span v-if="$v.form.passwordNewConfirm.$error" class="icon is-small is-right">
              <i class="fa fa-warning"></i>
            </span>
          </div>
          <p v-if="$v.form.passwordNewConfirm.$error" class="help is-danger">{{ $t('auth.register.validationErrorPasswordRepeat') }}</p>
        </div>
        <div class="field">
          <div class="password-strength-meter">
            <div class="password-strength-meter-inner"
              :class="strengthClass"></div>
          </div>
          <p class="help" v-if="this.form.passwordNew">
            {{ $t('auth.register.passwordSecurity') }}: <strong>{{ $t(`auth.register.passwordStrength${passwordStrength}`) }}</strong>
          </p>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <hc-button :isLoading="isLoading"
                  :disabled="isLoading"
                  @click.prevent="save">
        <i class="fa fa-check"></i>
        &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
      </hc-button>
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, sameAs, minLength } from 'vuelidate/lib/validators'
  import zxcvbn from 'zxcvbn'

  export default {
    transition: 'NONE',
    mixins: [animatable, validationMixin],
    data () {
      return {
        form: {
          passwordOld: '',
          passwordNew: '',
          passwordNewConfirm: ''
        },
        currentPasswortInvalid: false,
        isLoading: false
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      }),
      /**
       * passwordStrength is the score calculated by zxcvbn
       * @return {Number} Password Strength Score
       */
      passwordStrength () {
        return this.form.passwordNew ? zxcvbn(this.form.passwordNew).score : 0
      },
      strengthClass () {
        return `strength-${this.passwordStrength}`
      }
    },
    validations () {
      return {
        form: {
          passwordOld: {
            required
          },
          passwordNew: {
            required,
            minLength: minLength(8)
          },
          passwordNewConfirm: {
            required,
            sameAs: sameAs('passwordNew')
          }
        }
      }
    },
    methods: {
      async save () {
        this.currentPasswortInvalid = false

        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.animate('shake')
          this.isLoading = false
          this.$toast.open({
            message: this.$t('auth.validation.error'),
            type: 'is-danger'
          })
          return false
        }

        this.isLoading = true
        try {
          const res = await this.$api.service('authManagement').create({
            action: 'passwordChange',
            value: {
              user: {
                email: this.user.email
              },
              oldPassword: this.form.passwordOld,
              password: this.form.passwordNew
            }
          })
          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });
        } catch (err) {
          console.log('#ERR')
          console.error(err)
          if (err.errors.oldPassword) {
            this.currentPasswortInvalid = true
          }

          this.animate('shake')
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_animations";
  @import "assets/styles/_variables";

  .password-strength-meter {
    position: relative;
    height: 3px;
    background: $grey-lighter;
    margin: 10px auto 20px;
    border-radius: 3px;

    &:before, &:after {
      content: '';
      height: inherit;
      background: transparent;
      display: block;
      border-color: #FFF;
      border-style: solid;
      border-width: 0 6px 0 6px;
      box-sizing: border-box;
      position: absolute;
      width: calc(20% + 6px);
      z-index: 10;
    }

    &:before {
      left: calc(20% - 6px);
    }
    &:after {
      right: calc(20% - 6px);
    }
  }

  .password-strength-meter-inner {
    background: transparent;
    height: inherit;
    position: absolute;
    width: 0;
    border-radius: inherit;
    transition: width 0.5s ease-in-out, background 0.25s;
  }

  .password-strength-meter-inner {
    &.strength-0 {
      background: darken($orange, 40%);
      width: 20%;
    }
    &.strength-1 {
      background: darken(mix($orange, $yellow, 50%), 30%);
      width: 40%;
    }
    &.strength-2 {
      background: darken($yellow, 20%);
      width: 60%;
    }
    &.strength-3 {
      background: darken($green, 10%);
      width: 80%;
    }
    &.strength-4 {
      background: $green;
      width: 100%;
    }
  }
</style>
