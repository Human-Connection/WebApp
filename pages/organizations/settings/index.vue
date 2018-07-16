<template>
  <organization-form
    :formComponent="$options.components.FormComponent"
    :formData="formData"
    :updateFormData="updateFormData"
    :organization="organization"
    :user="user"
    :isLoading="isLoading">
    <template slot="header">
      <h2 class="title is-3">
        {{ $t('component.organization.stepBasics', 'Basics') }}
      </h2>
      <p class="subtitle is-6">{{ $t('component.organization.settingsWelcome') }}</p>
    </template>
  </organization-form>
</template>

<script>
  import OrganizationForm from '~/components/Organizations/OrganizationForm'
  import FormComponent from '~/components/Organizations/steps/OrgaFormStep1'

  export default {
    components: {
      OrganizationForm,
      FormComponent
    },
    props: {
      organization: {
        type: Object,
        required: true
      },
      user: {
        type: Object,
        required: true
      },
      isLoading: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        formData: {
          name: '',
          logo: '',
          isEnabled: false,
          language: this.$i18n.locale()
        }
      };
    },
    methods: {
      updateFormData (organization) {
        this.formData = Object.assign(this.formData, {
          name: organization.name,
          logo: organization.logo,
          isEnabled: organization.isEnabled,
          language: organization.language,
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>