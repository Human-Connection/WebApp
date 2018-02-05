<template>
  <form v-bind:disabled="isLoading">
    <!-- ToDo remove :test="true" for production -->
    <hc-upload :previewImage="form.teaserImg"
               :test="true"
               @update="value => { form.teaserImg = value }"
               @start-sending="uploadingCover = true"
               @stop-sending="uploadingCover = false"
               style="margin: -3.8rem -2.25rem 2.25rem;">
    </hc-upload>
    <div class="columns">
      <div class="column">
        <author :user="user" />
      </div>
      <div class="column"></div>
    </div>
    <hr/>
    <div class="tabs is-toggle is-fullwidth">
      <ul>
        <li v-for="(postType, index) in options.postTypes" v-bind:class="{ 'is-active': postType.active }" :key="index">
          <a v-bind:disabled="postType.disabled"
            @click="setPostType(index)"
            class="button is-medium">
            <span class="icon">
              <hc-icon :icon="'tools-'+postType.value" set="hc" />
            </span>
            <span>{{ postType.label }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="field">
      <label class="label">{{ $t('component.contribution.writePostSection') }}</label>
      <p class="control">
        <input class="input"
               v-model="form.title"
               type="text"
               v-bind:placeholder="$t('component.contribution.writePostSectionPlaceholder')"
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
          <div class="hc-editor-container">
            <div class="quill-editor story"
               v-model="form.content"
               :disabled="isLoading"
               @ready="editorReady = true"
               v-quill:myQuillEditor="editorOption"></div>
             <div class="plugins" v-if="editorReady && myQuillEditor">
               <editor-mentions :quill="myQuillEditor" />
             </div>
          </div>

        </div>
      </div>
    </no-ssr>
    <hr/>
    <div v-if="form.type === 'cando'">
      <div class="field">
        <label class="label">{{ $t('component.contribution.difficultyDescription') }}</label>
        <p class="control">
          <b-radio v-for="difficulty in options.difficulties"
            :key="difficulty" :native-value="difficulty"
            v-model="form.cando.difficulty">
              {{ $t(`difficulty.${difficulty}`) }}
          </b-radio>
        </p>
      </div>
      <hr/>
      <div class="field">
        <label class="label">{{ $t('component.contribution.canDoReasonTitle') }}</label>
        <p class="control has-margin-bottom-medium">
          <input class="input"
                 v-model="form.cando.reasonTitle"
                 type="text"
                 v-bind:placeholder="$t('component.contribution.canDoReasonTitlePlaceholder')"
                 v-bind:disabled="isLoading">
        </p>
      </div>
      <no-ssr>
        <div class="field">
          <label class="label">{{ $t('component.contribution.canDoReasonContent') }}</label>
          <div class="control">
            <div id="toolbar-editor2">
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
                 v-model="form.cando.reason"
                 :disabled="isLoading"
                 v-quill:myQuillEditor2="editorOption2"></div>
          </div>
        </div>
      </no-ssr>
      <hr/>
    </div>
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
  import EditorMentions from '~/components/Mentions/EditorMentions'
  import { isEmpty } from 'lodash'

  export default {
    name: 'hc-contributions-form',
    props: ['data'],
    components: {
      Author,
      CategoriesSelect,
      ContributionImage,
      EditorMentions
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
      const i18nEditor2Placeholder = this.$t('component.contribution.canDoReasonContentPlaceholder')
      return {
        editorReady: false,
        isLoading: false,
        uploadingCover: false,
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
          cando: {
            difficulty: null,
            reasonTitle: null,
            reason: null
          },
          ...this.data
        },
        options: {
          languages: [],
          visibilities: [],
          topics: [],
          tags: [],
          postTypes: [
            {
              label: 'Post',
              value: 'post',
              active: true,
              disabled: false
            },
            {
              label: 'Pro / Con',
              value: 'procon',
              active: false,
              disabled: true
            },
            {
              label: 'Can Do',
              value: 'cando',
              active: false,
              disabled: false
            }
          ],
          difficulties: ['easy', 'medium', 'hard']
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
        },
        editorOption2: {
          placeholder: i18nEditor2Placeholder,
          modules: {
            toolbar: {
              container: '#toolbar-editor2',
              handlers: {
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
        return !!this.uploadingCover
      }
    },
    methods: {
      setPostType (newIndex) {
        this.options.postTypes.forEach((postType, index) => {
          if (index === newIndex) {
            postType.active = true
            this.form.type = postType.value
          } else {
            postType.active = false
          }
        })
      },
      isValidURL (url) {
        return !!validUrl.isWebUri(url)
      },
      deleteDropFile (index) {
        this.dropFiles.splice(index, 1)
      },
      async onSubmit () {
        this.isLoading = true

        try {
          let formData = Object.assign({}, this.form)
          if (formData.type !== 'cando') {
            delete formData.cando
          }
          let res = null
          if (this.form._id) {
            res = await feathers.service('contributions').patch(formData._id, formData)
          } else {
            res = await feathers.service('contributions').create(formData)
          }
          this.$store.commit('newsfeed/clear')
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
        if (isEmpty(e.target.value)) {
          this.form.tags.pop()
        }
      },
      onTagTab (e) {
        if (!isEmpty(e.target.value)) {
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
