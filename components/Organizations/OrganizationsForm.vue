<template>
  <form :disabled="isLoading" :class="classes">
    <article class="message is-small">
      <div class="message-body">
        <i class="fa fa-warning"></i> {{ $t('component.organization.requiredHint') }}
      </div>
    </article>
    <div class="field">
      <div class="is-normal">
        <label class="label is-required">{{ $t('component.organization.type') }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control has-icons-left">
            <div class="select">
              <select v-model="form.type">
                <option value="ngo" selected>{{ $t('component.organization.types.ngo') }}</option>
                <option value="npo">{{ $t('component.organization.types.npo') }}</option>
                <option value="goodpurpose">{{ $t('component.organization.types.goodpurpose') }}</option>
                <option value="ev">{{ $t('component.organization.types.ev') }}</option>
                <option value="eva">{{ $t('component.organization.types.eva') }}</option>
              </select>
              <div class="icon is-small is-left">
                <i class="fa fa-cogs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="field">
      <label class="label is-required">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
      <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
    </div>
    <footer class="card-footer">
      <div class="field is-grouped">
        <div class="control">
          <hc-button :isLoading="isLoading"
                     color="light"
                     @click.prevent="onCancel">
            <span>{{ $t('component.organization.createLater') }}</span>
          </hc-button>
        </div>
        <div class="control">
          <hc-button :isLoading="isLoading"
                    :disabled="disabled"
                    @click.prevent="onSubmit">
            <i class="fa fa-check"></i>
            &nbsp;<span>{{ $t('component.organization.createSave') }}</span>
          </hc-button>
        </div>
      </div>
    </footer>
  </form>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    name: 'hc-organizations-form',
    props: ['data', 'id'],
    mixins: [animatable, validationMixin],
    components: {
      'categories-select': CategoriesSelect
    },
    head () {
      return {
        title: this.$t('component.organization.createNew')
      }
    },
    data () {
      return {
        isLoading: false,
        uploadingLogo: false,
        dropFiles: null,
        form: {
          _id: null,
          type: '',
          isEnabled: false,
          categoryIds: []
        },
        options: {
        },
        editorOption: {
          modules: {
            toolbar: {
              container: '#toolbar-editor',
              handlers: {}
            }
          }
        }
      }
    },
    validations () {
      return {
        form: {
          type: {
            required
          },
          categoryIds: {
            required
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      disabled () {
        return !!this.uploadingLogo
      }
    },
    mounted () {
      this.form._id = this.id
    },
    methods: {
      async onSubmit () {
        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.animate('shake')
          this.isLoading = false
          this.$toast.open({
            message: this.$t('auth.validation.error'),
            type: 'is-danger'
          })
          return false
        }

        this.isLoading = true

        try {
          let formData = Object.assign({}, this.form)
          if (this.form._id) {
            formData.isEnabled = true

            await this.$api.service('organizations')
              .patch(formData._id, formData)
            this.isLoading = false
            this.$snackbar.open({
              message: this.$t('component.organization.organizationSaveSuccess'),
              duration: 4000,
              type: 'is-success'
            })
            this.$emit('saved')
          } else {
            this.isLoading = false
            this.$toast.open({
              message: 'please provide an ID.',
              duration: 3000,
              type: 'is-danger'
            })
          }
        } catch (err) {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            duration: 3000,
            type: 'is-danger'
          })
        }
      },
      onCancel () {
        this.isLoading = false
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";
  @import "assets/styles/_animations";

  .textarea {
    margin-bottom: 10px;
    min-height: 80px;
  }

  .field .taginput .taginput-container.is-focusable {
    border: 1px solid $grey-lighter !important;
    box-shadow: none !important;
  }

  a[disabled] {
    pointer-events: none;
  }

  .hint {
    margin-bottom: 15px;
    i {
      color: red;
    }
  }

  .tabs {
    &.disabled {
      pointer-events: none;
      opacity: .5;
    }
  }

  .card {
    $padding: 1.5rem;

    footer.card-footer {
      margin: -$padding;
      margin-top: 2rem;
      background: lighten($grey-lighter, 10%);
      padding: 1rem $padding;
      display: flex;
      justify-content: right;
    }
  }
</style>
