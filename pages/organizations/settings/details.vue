<template>
  <organization-form
    :formComponent="$options.components.FormComponent"
    :formAttributes="formAttributes"
    :organization="organization"
    :user="user"
    :isLoading="isLoading">
    <template slot="header">
      <h2 class="title is-3">
        {{ $t('component.organization.stepDetails', 'Details') }}
      </h2>
      <!--<p class="subtitle is-6">{{ $t('component.organization.settingsWelcome') }}</p>-->
    </template>
  </organization-form>
</template>

<script>
  import OrganizationForm from '~/components/Organizations/OrganizationForm'
  import FormComponent from '~/components/Organizations/steps/OrgaFormStep2'

  export default {
    components: {
      OrganizationForm,
      FormComponent
    },
    data() {
      return {
        formAttributes: {
          description: '',
          url: '',
          email: '',
          phone: '',
          channels: [],
          type: null
        }
      };
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
    }
  };
</script>
