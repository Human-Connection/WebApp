<template>
  <div v-if="organization">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('component.organization.stepCategories', 'Categories') }}
      </h2>
      <!--<p class="subtitle is-6">{{ $t('component.organization.settingsWelcome') }}</p>-->
    </div>
    <hr>
    <div class="columns">
      <div class="column">
        <form @submit.prevent="$refs.form.validate()">
          <orga-form-step-3 ref="form" :data="form" @validate="onValidation" :hideButton="true" />
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
  import OrgaFormStep3 from "~/components/Organizations/steps/OrgaFormStep3.vue";

  export default {
    mixins: [],
    components: {
      OrgaFormStep3
    },
    data() {
      return {
        form: {
          categoryIds: []
        },
        organization: null,
        isLoading: false
      };
    },
    watch: {
      'this.$parent.$attrs.organization': (organization) => {
        // get current organization from parent view
        this.organization = this.organization
      }
    },
    mounted() {
      this.$nextTick(() => {
        // get current organization from parent view
        this.organization = this.$parent.$attrs.organization

        this.form = Object.assign(this.form, {
          categoryIds: this.organization.categoryIds
        })
      })
    },
    methods: {
      onValidation (result) {
        if (result) {
          this.form = Object.assign(this.form, result)
          this.save()
        } else {
          this.$toast.open({
            message: this.$t('auth.validation.error'),
              type: 'is-danger'
            })
          this.$parent.$emit('error')
        }
      },
      async save() {
        this.isLoading = true;
        try {
          let data = Object.assign({_id: this.organization._id}, this.form)
          const res = await this.$store.dispatch("organizations/patch", data)

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });

          // update the organization on the parent component
          this.$parent.$emit('change', res)
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isLoading = false;
      }
    }
  };
</script>
