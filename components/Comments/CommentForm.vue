<template>
  <div class="comment-form-container" v-if="post && isVerified">
    <hc-avatar :user="user" />
    <form class="comment-form" @submit.prevent="submitComment">
      <hc-editor identifier="comment"
        ref="editor"
        editorClass="autowrap"
        v-model="form.content"
        :editorOptions="editorOptions" />
      <button type="submit"
        class="submit-button button is-primary is-fullwidth"
        :disabled="!this.hasContent"
        :class="{ 'is-loading': isLoading }">
        {{ $t('button.submitComment','Submit comment') }}
      </button>
    </form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { trim } from 'lodash'

  export default {
    name: 'hc-comment-form',
    props: {
      post: {
        type: Object,
        required: true
      },
      replyComment: {
        type: Object
      }
    },
    data () {
      return {
        isLoading: false,
        form: {
          content: '',
          contributionId: null
        },
        editorOptions: {
          placeholder: this.$t('component.contribution.commentPlaceholder', 'Whatever comes to your mind...'),
          modules: {
            toolbar: null
          }
        }
      }
    },
    watch: {
      replyComment (comment) {
        this.reply(comment)
      }
    },
    mounted () {
      this.reply(this.replyComment)
    },
    computed: {
      ...mapGetters({
        isVerified: 'auth/isVerified',
        user: 'auth/user'
      }),
      hasContent () {
        return !!trim(this.form.content.replace(/(<([^>]+)>)/ig, '')).length
      }
    },
    methods: {
      reply (comment) {
        if (!comment) {
          return
        }
        const mention = `<p><a class="hc-editor-mention-blot" href="/profile/${comment.user.slug}" data-hc-mention="{&quot;_id&quot;:&quot;${comment.user._id}&quot;,&quot;slug&quot;:&quot;${comment.user.slug}&quot;}">@${comment.user.name}</a>&nbsp;</p>&nbsp;`
        // this.form.content = mention

        try {
          this.$refs.editor.$refs.editorMentions.insertMention(0, comment.user)
          // this.$refs.editor.myQuillEditor.clipboard.dangerouslyPasteHTML(mention)
          // this.$refs.editor.myQuillEditor.focus()
          // this.$refs.editor.myQuillEditor.setSelection(mention.length)
          this.$scrollTo(this.$refs.editor.$el, 500)
        } catch (err) {}
      },
      async submitComment () {
        if (!this.hasContent) {
          this.form.content = ''
          return
        }
        this.isLoading = true
        this.form.contributionId = this.post._id
        await this.$store.dispatch('comments/create', this.form)
          .then((res) => {
            this.$store.dispatch('comments/fetchByContributionId', this.post._id)
            this.$snackbar.open({
              message: this.$t('component.contribution.commentSubmitSuccess', 'Thanks for your comment. You are awesome.'),
              duration: 4000,
              type: 'is-success'
            })
            this.form.content = ''
          })
          .catch((error) => {
            console.error(error)
            this.$toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
        this.isLoading = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment-form-container {
    border-top: 1px solid $grey-lighter;
    padding-top: 20px;
  }

  .profile-image {
    float: left;
  }

  .comment-form {

    margin-left: 3.5rem;
  }

  .submit-button {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
</style>
