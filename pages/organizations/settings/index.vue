<template>
  <div v-if="organization">
    <div class="info-text columns">
      <div class="column">
        <h2 class="title is-3">
          {{ $t('component.organization.stepBasics', 'Basics') }}
        </h2>
        <p class="subtitle is-6">{{ $t('component.organization.settingsWelcome') }}</p>
      </div>
      <div class="column is-3 settings-left">
      </div>
    </div>
    <hr>
    <div class="columns">
      <div class="column">
        <form @submit.prevent="$refs.form.validate()">
          <orga-form-step-1 ref="form" :data="form" @validate="onValidation" :hideButton="true" :autoFocus="false" />
        </form>
        <div class="field has-margin-top-small">
          <div class="control">
            <label class="label">{{ $t('component.organization.visibility') }}</label>
            <b-switch v-model="form.isEnabled" :disabled="!canEnable">
              <span v-if="form.isEnabled">{{ $t('info.active') }}</span>
              <span v-else>{{ $t('info.inactive') }}</span>
            </b-switch>
          </div>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <hc-button
        :isLoading="isLoading"
        :disabled="isLoading"
        @click.prevent="$refs.form.validate()">
        <i class="fa fa-check"></i>
        &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
      </hc-button>
    </footer>
  </div>
</template>

<script>
  import OrgaFormStep1 from "~/components/Organizations/steps/OrgaFormStep1.vue";

  export default {
    mixins: [],
    components: {
      OrgaFormStep1
    },
    data() {
      return {
        form: {
          name: '',
          logo: '',
          isEnabled: false,
          language: this.$i18n.locale()
        },
        organization: null,
        isLoading: false
      };
    },
    watch: {
      'this.$parent.$attrs.organization': (organization) => {
        // get current organization from parent view
        this.organization = this.organization
      }
    },
    mounted() {
      this.$nextTick(() => {
        // get current organization from parent view
        this.organization = this.$parent.$attrs.organization

        this.form = Object.assign(this.form, {
          name: this.organization.name,
          logo: this.organization.logo,
          isEnabled: this.organization.isEnabled,
          language: this.organization.language,
        })
      })
    },
    computed: {
      canEdit () {
        // owner, moderator, admin
        return this.organization.userId === this.$parent.$attrs.user._id || ['admin', 'moderator'].includes(this.$parent.$attrs.user.role)
      },
      canEnable () {
        // owner (if reviewed), moderator, admin
        return ['admin', 'moderator'].includes(this.$parent.$attrs.user.role) || this.organization.reviewedBy
      }
    },
    methods: {
      onValidation (result) {
        if (result) {
          this.form = Object.assign(this.form, result)
          this.save()
        } else {
          this.$toast.open({
            message: this.$t('auth.validation.error'),
              type: 'is-danger'
            })
          this.$parent.$emit('error')
        }
      },
      async save() {
        this.isLoading = true;
        try {
          let data = Object.assign({_id: this.organization._id}, this.form)
          const res = await this.$store.dispatch("organizations/patch", data)

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });

          // update the organization on the parent component
          this.$parent.$emit('change', res)
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
          this.$parent.$emit('error', err)
        }
        this.isLoading = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .settings-left {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }
</style>
