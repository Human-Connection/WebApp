<template>
  <div v-if="organization">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.organizationUsers', 'Users') }}
      </h2>
    </div>
    <hr>
    <div class="columns">
      <div class="column">
        <form @submit.prevent="$refs.form.validate()">
          <orga-form-users ref="form"
            :data="form" @validate="onValidation"
            :hideButton="true" />
        </form>
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
  import OrgaFormUsers from "~/components/Organizations/steps/OrgaFormUsers.vue";

  export default {
    components: {
      OrgaFormUsers
    },
    props: {
      organization: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        form: {
          users: []
        },
        isLoading: false
      };
    },
    watch: {
      organization: {
        handler () {
          this.updateForm()
        },
        deep: true
      }
    },
    created () {
      this.updateForm()
    },
    methods: {
      updateForm () {
        this.form = Object.assign(this.form, {
          users: this.organization.users
        })
      },
      onValidation (result) {
        if (result) {
          this.form = Object.assign(this.form, result)
          this.$emit('save', this.form)
        } else {
          this.$toast.open({
            message: this.$t('auth.validation.error'),
              type: 'is-danger'
            })
          this.$parent.$emit('error')
        }
      }
    }
  };
</script>
