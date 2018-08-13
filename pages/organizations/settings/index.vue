<template>
  <organization-form
    :formComponent="$options.components.FormComponent"
    :formAttributes="formAttributes"
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
        formAttributes: {
          name: '',
          logo: '',
          isEnabled: false,
          language: this.$i18n.locale()
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
</style>