<template>
  <form v-bind:disabled="isLoading">
    <p class="hint"><i class="fa fa-warning"></i> {{ $t('component.organization.requiredHint') }}</p>
    <div class="field">
      <div class="is-normal">
        <label class="label">{{ $t('component.organization.type') }}</label>
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
    <div class="field">
      <label class="label">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
      <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
    </div>
    <no-ssr>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <hc-button :isLoading="isLoading"
                     :color="'light'"
                     @click.prevent="onCancel">
            <i class="fa fa-check"></i>
            &nbsp;<span>{{ $t('component.organization.createLater') }}</span>
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
    </no-ssr>
  </form>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'

  export default {
    name: 'hc-organizations-form',
    props: ['data', 'id'],
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
              handlers: {
                // TODO: do not use the prompt but the native quill dialoges or at least a nice modal
                //  handlers object will be merged with default handlers object
                // 'link': function (value) {
                //   if (value) {
                //     let href = prompt(i18nEditorLinkEnterUrl)
                //     this.quill.format('link', href)
                //   } else {
                //     this.quill.format('link', false)
                //   }
                // },
                // 'video': function () {
                //   let embedUrl = prompt(i18nEditorVideoEnterUrl)
                //   this.quill.format('video', embedUrl)
                // }
              }
            }
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
        this.isLoading = true

        try {
          let formData = Object.assign({}, this.form)
          if (this.form._id) {
            formData.isEnabled = true

            await this.app.$api.service('organizations').patch(formData._id, formData)
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
</style>
