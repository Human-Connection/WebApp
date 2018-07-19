<template>
  <organization-form
    :formComponent="$options.components.FormComponent"
    :formAttributes="formAttributes"
    :organization="organization"
    :user="user"
    :isLoading="isLoading">
    <template slot="header">
      <h2 class="title is-3">
        {{ $t('auth.settings.organizationUsers', 'Users') }}
      </h2>
    </template>
  </organization-form>
</template>

<script>
  import OrganizationForm from '~/components/Organizations/OrganizationForm'
  import FormComponent from '~/components/Organizations/OrgaFormUsers'

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
    async asyncData ({app, query, store, error, redirect}) {
      try {
        const organization = await app.$api.service('organizations').get(query.id)
        const user = store.getters['auth/user']
        const orgaOwner = organization.users.find(item => item.id === user._id.toString())
        if (!(orgaOwner && orgaOwner.role === 'admin')
          && ['admin', 'moderator'].includes(user.role) === false) {
          error({ statusCode: 403 })
        }
      } catch (err) {
        if (err.code === 404) {
          // redirect user to its organization list if it was not found
          redirect({name: 'auth-settings-organizations'})
        } else {
          error({statusCode: err.code || 500, message: err.message})
          return {}
        }
      }
    },
    data () {
      return {
        formAttributes: {
          users: []
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
</style>
