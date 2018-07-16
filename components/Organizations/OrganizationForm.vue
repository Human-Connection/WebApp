<template>
  <div v-if="organization">
    <div class="info-text columns">
      <div class="column">
        <slot name="header"></slot>
      </div>
      <div class="column is-3 settings-left">
        <slot name="aside"></slot>
      </div>
    </div>
    <hr>
    <form @submit.prevent="$refs.form.validate()">
      <div class="columns">
        <div class="column">
          <component ref="form"
            :data="formData" @validate="onValidation"
            :hideButton="true" :autoFocus="false"
            :canEnable="canEnable"
            :is="formComponent" />
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
    </form>
  </div>
</template>

<script>
  export default {
    name: 'organization-form',
    props: {
      formComponent: {
        type: Object,
        required: true
      },
      formData: {
        type: Object,
        required: true
      },
      updateFormData: {
        type: Function,
        required: true
      },
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
    watch: {
      organization: {
        handler (organization) {
          this.updateFormData(organization)
        },
        deep: true
      }
    },
    created () {
      this.updateFormData(this.organization)
    },
    computed: {
      canEnable () {
        // owner (if reviewed), moderator, admin
        return ['admin', 'moderator'].includes(this.user.role) || this.organization.reviewedBy
      }
    },
    methods: {
      onValidation (result) {
        if (result) {
          let formData = Object.assign(this.formData, result)
          this.$parent.$emit('save', formData)
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

<style lang="scss" scoped>
  .settings-left {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }
</style>
