<template>
  <div class="languages fullwidth-box" :class="classes">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.presentation', 'Presentation') }}
      </h2>
      <p class="subtitle is-6">{{ $t('auth.settings.presentationDescription') }}</p>
    </div>
    <hr>
    <div class="language-wrapper">
      <div class="columns">
        <div class="column">
          <div class="field">
            <div class="message is-warning">
              <div class="message-body" v-html="$t('auth.settings.presentationWarning')"></div>
            </div>
            <label class="label is-required" for="form-hideUsersWithoutTermsOfUseSigniture">{{ $t('auth.settings.presentationHideUsersWithoutTermsOfUseSignitureLabel') }}</label>
            <div class="control" id="form-hideUsersWithoutTermsOfUseSigniture">
              <b-switch
                v-model="form.hideUsersWithoutTermsOfUseSigniture">
                {{ form.hideUsersWithoutTermsOfUseSigniture ? $t('button.yes') : $t('button.no') }}
              </b-switch>
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
  import { required } from 'vuelidate/lib/validators'

  export default {
    mixins: [animatable],
    data() {
      return {
        form: {
          hideUsersWithoutTermsOfUseSigniture: false
        },
        isLoading: false,
      };
    },
    watch: {
      userSettings (userSettings) {
        this.form = Object.assign({}, userSettings)
      }
    },
    async mounted () {
      this.$nextTick(() => {
        this.form = Object.assign({}, this.userSettings)
      })
    },
    methods: {
      async save() {
        this.isLoading = true;
        try {
          const userSettings = await this.$store.dispatch('usersettings/patch', this.form, { root: true })

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });
          this.$store.commit('newsfeed/clear')
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
