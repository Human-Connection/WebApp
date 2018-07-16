<template>
  <organization-form
    :formComponent="$options.components.FormComponent"
    :formAttributes="formAttributes"
    :organization="organization"
    :user="user"
    :isLoading="isLoading">
    <template slot="header">
      <h2 class="title is-3">
        {{ $t('auth.settings.organizationAddresses', 'Addresses') }}
      </h2>
    </template>
  </organization-form>
</template>

<script>
  import OrganizationForm from '~/components/Organizations/OrganizationForm'
  import FormComponent from '~/components/Organizations/steps/OrgaFormAddresses'

  export default {
    components: {
      OrganizationForm,
      FormComponent
    },
    data() {
      return {
        formAttributes: {
          addresses: [],
          primaryAddressIndex: null
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
