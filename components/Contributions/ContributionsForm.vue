<template>
  <form v-bind:disabled="loading">
    <!-- ToDo remove :test="true" for production -->
    <hc-upload :preview-image="form.teaserImg"
               :test="true"
               @update="value => { form.teaserImg = value }"
               @start-sending="uploading = true"
               @stop-sending="uploading = false"
               style="margin: -3.8rem -2.25rem 2.25rem;">
    </hc-upload>
    <div class="columns">
      <div class="column">
        <author :post="{ user: user }"></author>
      </div>
      <div class="column"></div>
    </div>
    <hr/>
    <!--<div class="tabs is-toggle is-fullwidth">-->
      <!--<ul>-->
        <!--<li v-for="postType in options.postTypes" v-bind:class="{ 'is-active': postType.active }">-->
          <!--<a v-bind:disabled="postType.disabled" class="button is-medium">-->
                        <!--<span class="icon">-->
                            <!--<hc-icon :icon="'tools-'+postType.value" set="hc"></hc-icon>-->
                        <!--</span>-->
            <!--<span>{{ postType.label }}</span>-->
          <!--</a>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
    <div class="field">
      <label class="label">{{ $t('component.contribution.writePostSection') }}</label>
      <p class="control">
        <input class="input" v-model="form.title" type="text" v-bind:placeholder="$t('component.contribution.writePostSectionPlaceholder')"
               v-bind:disabled="isLoading">
      </p>
    </div>
    <div class="tags">
      <div v-for="(file, index) in dropFiles"
            :key="index"
            class="tag is-primary" >
          {{file.name}}
          <button class="delete is-small"
                  type="button"
                  @click="deleteDropFile(index)">
          </button>
      </div>
    </div>
    <no-ssr>
      <div class="field">
        <label class="label">{{ $t('component.contribution.writePostContent') }}</label>
        <div class="control">
          <div id="toolbar-editor">
            <div class="ql-formats">
              <b-tooltip :label="$t('component.editor.italic')" type="is-black">
                <button class="ql-italic"></button>
              </b-tooltip>
              <b-tooltip :label="$t('component.editor.bold')" type="is-black">
                <button class="ql-bold"></button>
              </b-tooltip>
              <b-tooltip :label="$t('component.editor.strike')" type="is-black">
                <button class="ql-strike"></button>
              </b-tooltip>
            </div>
            <div class="ql-formats">
              <b-tooltip :label="$t('component.editor.blockquote')" type="is-black">
                <button class="ql-blockquote"></button>
              </b-tooltip>
            </div>
            <div class="ql-formats">
              <b-tooltip :label="$t('component.editor.listUnordered')" type="is-black">
                <button class="ql-list" value="bullet" ></button>
              </b-tooltip>
              <b-tooltip :label="$t('component.editor.listOrdered')" type="is-black">
                <button class="ql-list" value="ordered" ></button>
              </b-tooltip>
            </div>
            <div class="ql-formats">
              <b-tooltip :label="$t('component.editor.link')" type="is-black">
                <button class="ql-link"></button>
              </b-tooltip>
              <b-tooltip :label="$t('component.editor.video')" type="is-black">
                <button class="ql-video"></button>
              </b-tooltip>
            </div>
          </div>
          <div class="quill-editor story"
               v-model="form.content"
               :disabled="isLoading"
               v-quill:myQuillEditor="editorOption"></div>
        </div>
      </div>
    </no-ssr>
    <hr/>
    <div class="field">
      <label class="label">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
      <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
    </div>
    <hr/>
    <no-ssr>
      <div class="field">
        <b-field label="Tags">
          <b-taginput
              maxtags="5"
              size="is-small"
              :value="form.tags"
              icon=""
              placeholder="Add a tag"
              @keyup.delete.native="onTagDelete"
              @keydown.tab.native="onTagTab">
          </b-taginput>
        </b-field>
      </div>
    </no-ssr>
    <br/>
    <hr/>
    <div class="field">
      <div class="control">
        <div class="level">
          <div class="level-item">
            <h6 class="title is-6">Language</h6>&nbsp;&nbsp;
            <div class="select">
              <select v-model="form.language">
                <option value="de" selected>DE</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>
          <div class="level-item">
            <h6 class="title is-6">Visibility</h6>&nbsp;&nbsp;
            <div class="select">
              <select v-model="form.visibility">
                <option value="public" selected>Public</option>
                <option value="friends">Friends only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- visibility -->
    <!-- tags -->
    <!-- uploads -->
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
            &nbsp;<span>{{ buttonPublishLabel }}</span>
          </hc-button>
        </div>
      </div>
    </no-ssr>
  </form>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'
  import Author from '~/components/Author/Author.vue'
  import {mapGetters} from 'vuex'
  import validUrl from 'valid-url'
  import ContributionImage from '~/components/Contributions/ContributionImage.vue'
  import _ from 'lodash'

  export default {
    name: 'hc-contributions-form',
    props: ['data'],
    components: {
      Author,
      ContributionImage,
      'categories-select': CategoriesSelect
    },
    head () {
      return {
        title: this.$t('component.contribution.writePost')
      }
    },
    data () {
      // const i18nEditorLinkEnterUrl = this.$t('component.editor.linkEnterUrl')
      // const i18nEditorVideoEnterUrl = this.$t('component.editor.videoEnterUrl')
      const i18nEditorPlaceholder = this.$t('component.contribution.writePostContentPlaceholder')
      return {
        isLoading: false,
        uploading: false,
        dropFiles: null,
        form: {
          _id: null,
          type: 'post',
          teaserImg: null,
          title: '',
          content: '',
          language: this.$i18n.locale(),
          visibility: 'public',
          categoryIds: [],
          tags: [],
          attachments: [],
          ...this.data
        },
        options: {
          languages: [],
          visibilities: [],
          topics: [],
          tags: [],
          postTypes: [
            {label: 'Post', value: 'post', active: true},
            {label: 'Pro / Con', value: 'procon', disabled: false},
            {label: 'Can Do', value: 'cando', disabled: false}
          ]
        },
        editorOption: {
          placeholder: i18nEditorPlaceholder,
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
      buttonPublishLabel () {
        return this.form._id ? this.$t('button.update') : this.$t('button.publish')
      },
      disabled () {
        return !!this.uploading
      }
    },
    methods: {
      isValidURL (url) {
        return !!validUrl.isWebUri(url)
      },
      deleteDropFile (index) {
        this.dropFiles.splice(index, 1)
      },
      async onSubmit () {
        this.isLoading = true

        try {
          let res = null
          if (this.form._id) {
            res = await feathers.service('contributions').patch(this.form._id, this.form)
          } else {
            res = await feathers.service('contributions').create(this.form)
          }
          this.$snackbar.open({
            message: this.$t('component.contribution.messageSaveSuccess'),
            duration: 4000,
            type: 'is-success'
          })
          this.$router.push(`/contributions/${res.slug}?refresh=true`)
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
      onTagDelete (e) {
        if (_.isEmpty(e.target.value)) {
          this.form.tags.pop()
        }
      },
      onTagTab (e) {
        console.log(e.target.value)
        if (!_.isEmpty(e.target.value)) {
          setTimeout(() => {
            e.target.focus()
          }, 20)
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
</style>
