<template>
  <div>
    <div class="under-construction" style="min-height: 200px">
      <h2 class="title is-3">{{ $t('component.projects.label') }}</h2>
    </div>
    <!--<footer class="card-footer">
      <hc-button
        :isLoading="isLoading"
        :disabled="isLoading"
        @click.prevent="save">
        <i class="fa fa-check"></i>
        &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
      </hc-button>
    </footer>-->
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { isEmpty } from "lodash";
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'

  export default {
    mixins: [validationMixin],
    components: {
      'categories-select': CategoriesSelect
    },
    validate ({params}) {
      return /^[a-zA-Z0-9_-]*$/.test(params.slug)
    },
    data() {
      return {
        form: {
          name: "",
          description: "",
          type: '',
          categoryIds: []
        },
        isLoading: false
      };
    },
    validations () {
      let rules = {
        description: {
          minLength: minLength(10),
          maxLength: maxLength(300)
        },
      }

      return {
        form: rules
      }
    },
    mounted() {
      this.form.name = this.organization.name
      this.form.description = this.organization.description
      this.form.type = this.organization.type
      if (this.organization.categoryIds.length > 0) {
        this.organization.categoryIds.forEach((catId, index) => {
          this.form.categoryIds.push(catId)
        })
      }
    },
    async asyncData ({app, params, error}) {
      try {
        const organization = await app.$api.service('organizations').find({
          query: {
            slug: params.slug
          }
        })
        return {
          organization: organization.data[0] || []
        }
      } catch (err) {
        error({statusCode: err.code || 500, message: err.message})
        return {}
      }
    },
    methods: {
      async save() {
        this.isLoading = true;
        try {
          let data = Object.assign({_id: this.organization._id}, this.form)
          await this.$store.dispatch("organizations/patch", data)

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isLoading = false;
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    }
  };
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";
</style>

