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
        formData: {
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
    },
    methods: {
      updateFormData (organization) {
        this.formData = Object.assign(this.formData, {
          description: organization.description,
          url: organization.url,
          email: organization.email,
          phone: organization.phone,
          channels: organization.channels,
          type: organization.type
        })
      }
    }
  };
</script>
