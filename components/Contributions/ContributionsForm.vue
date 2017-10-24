<template>
  <form v-bind:disabled="loading">
    <contribution-image :src="form.teaserImg" v-if="isValidURL(form.teaserImg)"
                        style="margin: -3.8rem -2.25rem 2.25rem;"></contribution-image>
    <div class="columns">
      <div class="column">
        <author :post="{ user: user }"></author>
      </div>
      <div class="column"></div>
    </div>
    <hr/>
    <div class="field">
      <label class="label">{{ $t('component.contribution.writePostImageLabel') }}</label>
      <p class="control">
        <input class="input" v-model="form.teaserImg" type="text" v-bind:placeholder="$t('component.contribution.writePostImagePlaceholder')"
               v-bind:disabled="loading">
      </p>
    </div>
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
               v-bind:disabled="loading">
      </p>
    </div>
    <!--<label class="label">Titelbild Upload</label>-->
    <!--<b-field>-->
      <!--<b-upload v-model="dropFiles" drag-drop>-->
        <!--<section class="section">-->
          <!--<div class="content has-text-centered">-->
            <!--<p>-->
              <!--<b-icon-->
                  <!--icon="file_upload"-->
                  <!--size="is-large">-->
              <!--</b-icon>-->
            <!--</p>-->
            <!--<p>Drop your files here or click to upload</p>-->
          <!--</div>-->
        <!--</section>-->
      <!--</b-upload>-->
    <!--</b-field>-->
    <!--<figure class="image" style="background-image: url('http://bulma.io/images/placeholders/640x320.png')">-->
      <!--<img v-bind:src="form.teaserImg" style="min-height: 320px;">-->
    <!--</figure>-->
    <div class="tags">
      <span v-for="(file, index) in dropFiles"
            :key="index"
            class="tag is-primary" >
          {{file.name}}
          <button class="delete is-small"
                  type="button"
                  @click="deleteDropFile(index)">
          </button>
      </span>
    </div>
    <div class="field">
      <label class="label">{{ $tc('component.category.labelNoneOnePlural', 2) }}</label>
      <categories-select v-model="form.categoryIds"></categories-select>
    </div>
    <no-ssr>
      <div class="field">
        <label class="label">{{ $t('component.contribution.writePostContent') }}</label>
        <div class="control">
          <div class="quill-editor" v-model="form.content" v-quill:myQuillEditor="editorOption"></div>
        </div>
      </div>
    </no-ssr>
    <!-- language -->
    <!-- visibility -->
    <!-- topics -->
    <!-- tags -->
    <!-- uploads -->
    <no-ssr>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button class="button is-medium is-white" @click.prevent="$router.back()">
            <i class="fa fa-times"></i> &nbsp;{{ $t('component.contribution.actionCancel') }}
          </button>
        </div>
        <div class="control">
          <button class="button is-medium is-success" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading"
                  @click.prevent="onSubmit">
            <i class="fa fa-check"></i> &nbsp;{{ $t('component.contribution.action-' + buttonLabelKey) }}
          </button>
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
      return {
        loading: false,
        dropFiles: null,
        form: {
          _id: null,
          type: 'post',
          teaserImg: null,
          title: '',
          content: '',
          language: 'de_DE',
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
          placeholder: this.$t('component.contribution.writePostEditorContentPlaceholder'),
          modules: {
            toolbar: {
              container: [
                ['bold', 'strike'],
                ['blockquote'],
                ['link', 'video']
              ]
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      buttonLabelKey () {
        return this.form._id ? 'Update' : 'Publish'
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
        this.loading = true
        console.log(this.form)

        try {
          let res = null
          if (this.form._id) {
            res = await feathers.service('contributions').patch(this.form._id, this.form)
          } else {
            res = await feathers.service('contributions').create(this.form)
          }
          this.loading = false
          this.$toast.open({
            message: 'Thanks for your contribution. You are awesome.',
            duration: 2000,
            type: 'is-success'
          })
          this.$router.push(`/contributions/${res.slug}?refresh=true`)
        } catch (err) {
          console.log(err)
          this.loading = false
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

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .textarea {
    margin-bottom: 10px;
    min-height: 80px;
  }
</style>
