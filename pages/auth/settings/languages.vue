<template>
  <div class="languages fullwidth-box" :class="classes">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.languageSettings') }}
      </h2>
      <p class="subtitle is-6">{{ $t('auth.settings.languageSettingsText') }}</p>
    </div>
    <hr>
    <div class="language-wrapper">
      <div class="columns">
        <div class="column">
          <div class="field"
               :class="{ 'has-error': $v.form.contentLanguages.$error }">
            <label class="label is-required" for="form-contentLanguages">{{ $t('auth.settings.contentLanguagesLabel') }}</label>
            <div class="control" id="form-contentLanguages">
              <b-switch
                v-model="selectedContentLanguages.de"
                @click.native="toggleLanguage('de')">
                Deutsch
              </b-switch>
              <b-switch
                v-model="selectedContentLanguages.en"
                @click.native="toggleLanguage('en')">
                English
              </b-switch>
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
                    @input="$v.form.uiLanguage.$touch()"
                    native-value="de">
                    Deutsch
                </b-radio>
                <b-radio v-model="form.uiLanguage"
                    @input="$v.form.uiLanguage.$touch()"
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
  import { isEmpty, keys } from "lodash";
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    mixins: [animatable, validationMixin],
    data() {
      return {
        form: {
          contentLanguages: [],
          uiLanguage: this.$i18n.locale()
        },
        isLoading: false,
        selectedContentLanguages: {
          de: false,
          en: false
        }
      };
    },
    validations () {
      return {
        form: {
          contentLanguages: {
            required
          },
          uiLanguage: {
            required
          }
        }
      }
    },
    watch: {
      userSettings (userSettings) {
        this.form = Object.assign({}, userSettings)
      },
      'form.contentLanguages' (languages) {
        // update selectedContentLanguage values with values from contentLanguages
        this.selectedContentLanguages = {
          de: Boolean(languages.indexOf('de') >= 0),
          en: Boolean(languages.indexOf('en') >= 0)
        }
      }
    },
    async mounted () {
      this.$nextTick(() => {
        this.form = Object.assign({}, this.userSettings)
      })
    },
    methods: {
      toggleLanguage (lang) {
        this.$v.form.contentLanguages.$touch()
        // set the contentLanguages to the toggle values
        this.$nextTick(() => {
          const res = _.transform(this.selectedContentLanguages, (result, value, key) => {
            (result[value] || (result[value] = [])).push(key);
          }, {});
          this.form.contentLanguages = res.true || []
        })
      },
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
