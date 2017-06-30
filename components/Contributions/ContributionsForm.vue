<template>
    <form v-bind:disabled="loading">
        <div class="tabs is-toggle is-fullwidth">
            <ul>
                <li v-for="postType in options.postTypes" v-bind:class="{ 'is-active': postType.active }">
                    <a v-bind:disabled="postType.disabled" class="button is-medium">
                        <span class="icon">
                            <i v-bind:class="'icon-tools-'+postType.value"></i>
                        </span>
                        <span>{{ postType.label }}</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="field">
            <label class="label">Title</label>
            <p class="control">
                <input class="input" v-model="form.title" type="text" placeholder="How do you call that story?" v-bind:disabled="loading">
            </p>
        </div>
        <div class="field">
            <label class="label">Content</label>
            <div class="control">
                <div class="quill-editor" v-model="form.content" v-quill:myQuillEditor="editorOption"></div>
            </div>
        </div>
        <!-- language -->
        <!-- visibility -->
        <!-- topics -->
        <!-- tags -->
        <!-- uploads -->
        <div class="field has-text-right">
            <button class="button is-success" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading" @click.prevent="onSubmit">{{ buttonLabel }}</button>
        </div>
    </form>
</template>

<script>
  import NoSSR from 'vue-no-ssr'
  import feathers from '~plugins/feathers'

  export default {
    props: ['data'],
    name: 'contributions-form',
    components: {
      'no-ssr': NoSSR
    },
    data () {
      return {
        loading: false,
        form: {
          _id: null,
          type: 'post',
          title: '',
          content: '',
          language: 'de_DE',
          visibility: 'public',
          topics: [0, 1],
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
          placeholder: 'What to write?',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block']
            ]
          }
        }
      }
    },
    computed: {
      buttonLabel () {
        return this.form._id ? 'Update' : 'Publish'
      }
    },
    methods: {
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
          console.log(res)
          this.$toast.open({
            message: 'Thanks for your contribution. You are awesome.',
            duration: 2000,
            type: 'is-success'
          })
          this.$router.push(`/contributions/${res.slug}`)
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
    @import "../../assets/styles/utilities";

    .textarea {
        margin-bottom: 10px;
        min-height:    80px;
    }
</style>
