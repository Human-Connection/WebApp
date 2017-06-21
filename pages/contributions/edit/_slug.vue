<template>
    <div class="columns">
        <div class="card column is-8 is-offset-2">
            <section class="section">
                <h1 class="title">Edit {{ title }}</h1>
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
                    <div class="field has-text-right">
                        <button class="button is-success" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading" @click.prevent="onSubmit">Update</button>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>


<script>
  import NoSSR from 'vue-no-ssr'
  import feathers from '~plugins/feathers'

  export default {
    middleware: ['authenticated', 'owner'],
    components: {
      'no-ssr': NoSSR
    },
    async asyncData ({params, error}) {
      try {
        let res = await feathers.service('contributions').find({
          query: {
            slug: params.slug
          }
        })
        const data = res.data[0]
        return {
          form: {
            _id: data._id,
            title: data.title,
            content: data.content,
            slug: data.slug
          },
          title: data.title
        }
      } catch (err) {
        error({statusCode: err.code || 500, message: err.message})
        return {}
      }
    },
    data () {
      return {
        loading: false,
        form: {
          type: 'post',
          title: '',
          content: '',
          language: 'de_DE',
          visibility: 'public',
          topics: [0, 1],
          tags: [],
          attachments: []
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
    mounted () {
      console.log('app init, my quill instance object is:', this.myQuillEditor)
      setTimeout(() => {
        this.content = 'i am changed'
      }, 3000)
    },
    methods: {
      onSubmit () {
        this.loading = true
        console.log(this.form)
        feathers.service('contributions').patch(this.form._id, this.form)
          .then((res) => {
            this.loading = false
            console.log(res)
            this.$toast.open({
              message: 'Your Contribution is fresh now.',
              duration: 2000,
              type: 'is-success'
            })
            this.$router.push(`/contributions/${this.form.slug}`)
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
          })
      },
      onPicture (e) {
        alert('NEW IMAGE!')
      }
    },
    head () {
      return {
        title: `Edit ${this.title}`
      }
    }
  }
</script>

<style>

</style>
