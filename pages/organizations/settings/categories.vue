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
        {{ $t('component.organization.stepCategories', 'Categories') }}
      </h2>
      <!--<p class="subtitle is-6">{{ $t('component.organization.settingsWelcome') }}</p>-->
    </template>
  </organization-form>
</template>

<script>
  import OrganizationForm from '~/components/Organizations/OrganizationForm'
  import FormComponent from '~/components/Organizations/steps/OrgaFormStep3'

  export default {
    components: {
      OrganizationForm,
      FormComponent
    },
    data() {
      return {
        formData: {
          categoryIds: [],
          tags: []
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
          categoryIds: organization.categoryIds,
          tags: organization.tags
        })
      }
    }
  };
</script>
