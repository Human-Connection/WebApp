<template>
  <div class="languages fullwidth-box" :class="classes">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.languageSettings') }}
      </h2>
      <p>{{ $t('auth.settings.languageSettingsText') }}</p>
    </div>
    <hr>
    <div class="language-wrapper">
      <div class="columns">
        <div class="column">
          <div class="field"
               :class="{ 'has-error': $v.form.contentLanguages.$error }">
            <label class="label is-required" for="form-contentLanguages">{{ $t('auth.settings.contentLanguagesLabel') }}</label>
            <div class="control" id="form-contentLanguages">
              <b-checkbox
                v-model="form.contentLanguages"
                native-value="de">
                Deutsch
              </b-checkbox>
              <b-checkbox
                v-model="form.contentLanguages"
                native-value="en">
                English
              </b-checkbox>
            </div>
            <p v-if="$v.form.contentLanguages.$error" class="help is-danger">{{ $t('auth.settings.validationErrorContentLanguages') }}</p>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <div class="control">
              <label class="label is-required" for="form-uiLanguages">{{ $t('auth.settings.interfaceLanguageLabel') }}</label>
              <div class="block" id="form-uiLanguages">
                <b-radio v-model="form.uiLanguage"
                    native-value="de">
                    Deutsch
                </b-radio>
                <b-radio v-model="form.uiLanguage"
                    native-value="en">
                    English
                </b-radio>
              </div>
            </div>
          </div>

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
  import { mapGetters } from "vuex";
  import { isEmpty } from "lodash";
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    transition: 'NONE',
    mixins: [animatable, validationMixin],
    data() {
      return {
        form: {
          contentLanguages: null
        },
        isLoading: false
      };
    },
    validations () {
      return {
        form: {
          contentLanguages: {
            required
          }
        }
      }
    },
    watch: {
      userSettings (userSettings) {
        this.form = Object.assign({}, userSettings)
      }
    },
    async mounted () {
      this.form = Object.assign({}, this.userSettings)
    },
    methods: {
      async save() {
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

        this.isLoading = true;
        try {
          const userSettings = await this.$store.dispatch('usersettings/patch', this.form, { root: true })

          if (this.$i18n.localeExists(this.form.uiLanguage)) {
            this.$i18n.set(this.form.uiLanguage)
          } else {
            const res = await import(`~/locales/${this.form.uiLanguage}.json`)
            this.$i18n.add(this.form.uiLanguage, res)
            this.$i18n.set(this.form.uiLanguage)
          }
          this.$store.commit('newsfeed/clear')

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isLoading = false;
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user",
        userSettings: "auth/userSettings"
      })
    }
  };
</script>

<style lang="sass" scoped>
  @import "assets/styles/_animations";
</style>
