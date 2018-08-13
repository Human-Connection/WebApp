<template>
  <organization-form
    :formComponent="$options.components.FormComponent"
    :formAttributes="formAttributes"
    :organization="organization"
    :user="user"
    :isLoading="isLoading">
    <template slot="header">
      <h2 class="title is-3">
        {{ $t('auth.settings.organizationChannels', 'Channels') }}
      </h2>
    </template>
  </organization-form>
</template>

<script>
  import OrganizationForm from '~/components/Organizations/OrganizationForm'
  import FormComponent from '~/components/Organizations/OrgaFormChannels'

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
          channels: []
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
</style>
