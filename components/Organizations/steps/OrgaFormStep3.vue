<template>
  <div>
    <div class="field"
          :class="{ 'has-error': $v.form.categoryIds.$error }">
      <label class="label is-required">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
      <categories-select v-model="form.categoryIds"
                         :disabled="isLoading"></categories-select>
      <p :class="{ 'is-hidden': !$v.form.categoryIds.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
    </div>
    <slot v-if="!hideButton">
      <hc-button color="primary"
                @click.prevent="validate()"
                size="medium"
                type="button"
                class="is-fullwidth"
                :isLoading="isLoading"
                :disabled="isLoading">
        {{ $t('button.next') }} <hc-icon class="icon-right" icon="angle-right" />
      </hc-button>
    </slot>
  </div>
</template>

<script>
  import CategoriesSelect from "~/components/Categories/CategoriesSelect.vue";
  import { validationMixin } from "vuelidate";
  import { required, minLength, maxLength } from "vuelidate/lib/validators";

  export default {
    components: {
      "categories-select": CategoriesSelect
    },
    mixins: [validationMixin],
    props: {
      data: {
        type: Object
      },
      hideButton: {
        type: Boolean,
        default: false
      }
    },
    name: 'orga-form-step-3',
    data () {
      return {
        form: {
          categoryIds: []
        },
        isLoading: false
      }
    },
    watch: {
      data (data) {
        this.updateData(data)
      },
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.updateData(this.data)
      })
    },
    methods: {
      updateData (data) {
        this.form = Object.assign(this.form, {
          categoryIds: data.categoryIds
        })
      },
      validate () {
        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          this.$emit('validate', this.form)
        }
      }
    },
    validations() {
      return {
        form: {
          categoryIds: {
            required
          }
        }
      };
    }
  }
</script>
