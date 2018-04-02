<template>
  <div class="languages fullwidth-box">
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
          <div class="field">
            <label class="label" for="form-contentLanauages">{{ $t('auth.settings.contentLanguagesLabel') }}</label>
            <div class="control" id="form-contentLanauages">
              <b-checkbox
                v-model="usersettings.contentLanguages"
                native-value="de">
                Deutsch
              </b-checkbox>
              <b-checkbox
                v-model="usersettings.contentLanguages"
                native-value="en">
                English
              </b-checkbox>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <div class="control">
              <label class="label" for="form-uiLanguages">{{ $t('auth.settings.interfaceLanguageLabel') }}</label>
              <div class="block" id="form-uiLanguages">
                <b-radio v-model="usersettings.uiLanguage"
                    native-value="de">
                    Deutsch
                </b-radio>
                <b-radio v-model="usersettings.uiLanguage"
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

  export default {
    transition: 'NONE',
    data() {
      return {
        form: {
        },
        usersettings: {},
        isLoading: false
      };
    },
    watch: {
      user (user) {
        this.usersettings = Object.assign({}, user.usersettings)
      }
    },
    async mounted () {
      this.usersettings = Object.assign({}, this.user.usersettings)
    },
    methods: {
      async save() {
        this.isLoading = true;
        try {
          await this.$store.dispatch('usersettings/patch', this.usersettings);

          this.$store.dispatch('newsfeed/clear')

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            class: "is-success"
          });
        } catch (err) {
          this.$toast.open({
            message: err.message,
            class: "is-danger"
          });
        }
        this.isLoading = false;
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    }
  };
</script>
