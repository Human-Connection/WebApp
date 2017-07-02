<template>
    <form class="comment-form" v-if="post && isVerified" @submit.prevent="submitComment">
        <div class="quill-editor autowrap" v-model="form.content" v-quill:myQuillEditor="editorOption"></div>
        <button type="submit" class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }">Submit comment</button>
    </form>
</template>

<script>
  import {mapGetters} from 'vuex'
  import feathers from '~plugins/feathers'

  export default {
    props: ['post'],
    computed: {
      ...mapGetters({
        isVerified: 'auth/isVerified'
      })
    },
    data () {
      return {
        loading: false,
        form: {
          content: '',
          contributionId: null,
          language: 'de_DE'
        },
        editorOption: {
          placeholder: 'Whatever comes to your mind...',
          modules: {
            toolbar: null
          }
        }
      }
    },
    methods: {
      submitComment () {
        this.loading = true
        this.form.contributionId = this.post._id
        feathers.service('comments').create(this.form)
          .then((res) => {
            this.loading = false
            this.form.content = ''
            console.log(res)
            this.$toast.open({
              message: 'Thanks for your comment. You are awesome.',
              duration: 2000,
              type: 'is-success'
            })
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
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/utilities";

    .textarea {
        margin-bottom:10px;
        min-height: 80px;
    }
</style>
