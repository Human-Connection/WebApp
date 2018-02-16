<template>
  <form v-bind:disabled="isLoading">
    <div class="field">
      <label class="label">{{ $t('component.organization.name') }}</label>
      <p class="control">
        <input class="input"
               v-model="form.name"
               type="text"
               v-bind:placeholder="$t('component.organization.createOrgaSectionPlaceholder')"
               v-bind:disabled="isLoading">
      </p>
    </div>
    <div class="field">
      <label class="label">{{ $t('component.organization.logo') }}</label>
      <hc-upload class="avatar-upload"
                 :preview-image="form.logo"
                 @update="value => { form.logo = value }"
                 @start-sending="uploadingLogo = true"
                 @stop-sending="uploadingLogo = false">
      </hc-upload>
    </div>
    <no-ssr>
      <div class="field">
        <label class="label">{{ $t('component.organization.orgaDescription') }}</label>
        <div class="control">
          <div id="toolbar-editor">
            <div class="ql-formats">
              <b-tooltip :label="$t('component.editor.italic')" type="is-black">
                <button class="ql-italic"></button>
              </b-tooltip>
              <b-tooltip :label="$t('component.editor.bold')" type="is-black">
                <button class="ql-bold"></button>
              </b-tooltip>
            </div>
          </div>
          <div class="quill-editor story"
               v-model="form.description"
               :disabled="isLoading"
               v-quill:myQuillEditor="editorOption"></div>
        </div>
      </div>
    </no-ssr>
    <div class="field">
      <label class="label">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
      <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
    </div>
    <div class="columns">
      <div class="column">
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
      </div>
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.foundingYear') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.foundingYear"
                   type="text"
                   v-bind:placeholder="$t('component.organization.foundingYearSectionPlaceholder')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.street') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.street"
                   type="text"
                   v-bind:placeholder="$t('component.organization.street')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.zipcode') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.zipcode"
                   type="text"
                   v-bind:placeholder="$t('component.organization.zipcode')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.city') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.city"
                   type="text"
                   v-bind:placeholder="$t('component.organization.city')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.country') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.country"
                   type="text"
                   v-bind:placeholder="$t('component.organization.country')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.email') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.email"
                   type="text"
                   v-bind:placeholder="$t('component.organization.email')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.phone') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.phone"
                   type="text"
                   v-bind:placeholder="$t('component.organization.phone')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('component.organization.website') }}</label>
          <p class="control">
            <input class="input"
                   v-model="form.website"
                   type="text"
                   v-bind:placeholder="$t('component.organization.website')"
                   v-bind:disabled="isLoading">
          </p>
        </div>
      </div>
    </div>
    <hr/>
    <no-ssr>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button class="button has-text-grey is-white" @click.prevent="$router.back()">
            <i class="fa fa-times"></i>
            &nbsp;{{ $t('button.cancel') }}
          </button>
        </div>
        <div class="control">
          <hc-button :isLoading="isLoading"
                     :disabled="disabled"
                     @click.prevent="onSubmit">
            <i class="fa fa-check"></i>
            &nbsp;<span>{{ $t('component.organization.createSubmit') }}</span>
          </hc-button>
        </div>
      </div>
    </no-ssr>
  </form>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import {mapGetters} from 'vuex'
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'

  export default {
    name: 'hc-organizations-form',
    props: ['data'],
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
          name: '',
          description: '',
          type: '',
          foundingYear: '',
          logo: '',
          street: '',
          zipcode: '',
          city: '',
          country: '',
          phone: '',
          email: '',
          website: '',
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
    methods: {
      async onSubmit () {
        this.isLoading = true

        try {
          let formData = Object.assign({}, this.form)
          let res = null
          if (this.form._id) {
            res = await feathers.service('organizations').patch(formData._id, formData)
          } else {
            res = await feathers.service('organizations').create(formData)
          }
          this.$snackbar.open({
            message: this.$t('component.organization.organizationSaveSuccess'),
            duration: 4000,
            type: 'is-success'
          })
          this.$router.push(`/organizations/${res.slug}`)
        } catch (err) {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            duration: 3000,
            type: 'is-danger'
          })
        }
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

  .tabs {
    &.disabled {
      pointer-events: none;
      opacity: .5;
    }
  }
</style>
