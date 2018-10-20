<template>
  <div class="comment-form-container" v-if="post && isVerified">
    <div class="comment-form-aside">
      <hc-avatar :user="user" />
    </div>
    <form class="comment-form" @submit.prevent="submitComment">
      <hc-editor identifier="comment"
        ref="editor"
        v-on:input="editorText"
        editorClass="autowrap"
        v-model="form.content"
        :editorOptions="editorOptions" />
      <div class="comment-form-actions">
        <button type="button"
          class="button is-hidden-mobile"
          :disabled="this.isCommentFormOfContribution ? !this.hasContent : false"
          @click="cancel(form)">
          {{ $t('button.cancel') }}
        </button>
        <button type="submit"
          class="button is-primary"
          :disabled="!this.hasContent"
          :class="{ 'is-loading': isLoading }">
          {{ $t('button.submitComment','Submit comment') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
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
      },
      isCommentFormOfContribution: {
        type: Boolean,
        default: false
      },
      depth: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        isLoading: false,
        isExecuted: false,
        form: {
          content: '',
          contributionId: null,
          parentCommentId: null
        },
        editorOptions: {
          placeholder: this.$t('component.contribution.commentPlaceholder', 'Whatever comes to your mind...'),
          modules: {
            toolbar: null,
            pasteHandler: {}
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
        user: 'auth/user',
        isSubmitting: 'comments/isSubmitting'
      }),
      hasContent () {
        return !!trim(this.form.content.replace(/(<([^>]+)>)/ig, '')).length
      }
    },
    methods: {
      cancel (form) {
        if (this.isCommentFormOfContribution) {
          form.content = ''
        } else if(this.replyComment) {
          this.$parent.closeCommentForm()
        }
      },
      editorText (newText) {
        this.$emit('input', newText)
      },
      reply (comment) {
        if (!comment) {
          return
        }
        if (!this.isExecuted && !this.isSubmitting && this.$el.children[1].parentElement.id != 'comment-form') {
          this.isExecuted = true
          this.$nextTick(function () {
            this.$refs.editor.$refs.editorMentions.insertMention(0, comment.user)
            this.$scrollTo(this.$el.children[1], 500)
            setTimeout(() => { this.isExecuted = false }, 700)
          })
        }
      },
      async submitComment () {
        await this.$store.dispatch('comments/setSubmitting', true)

        if (!this.hasContent) {
          this.form.content = ''
          return
        }

        this.isLoading = true
        this.form.contributionId = this.post._id
        this.form.parentCommentId = this.replyComment ? this.replyComment._id : null

       this.$store.dispatch('comments/create', this.form)
          .then(async (res) => {
            this.$snackbar.open({
              message: this.$t('component.contribution.commentSubmitSuccess', 'Thanks for your comment. You are awesome.'),
              duration: 4000,
              type: 'is-success'
            })
            debugger
            await this.$store.dispatch('comments/fetchByContributionId', this.post._id)
            this.form.content = ''
            this.isLoading = false
          })
          .catch((error) => {
            console.error(error)
            this.$toast.open({
              message: error.message,
              type: 'is-danger'
            })
            this.isLoading = false
          })

        if (this.replyComment) {
          this.$parent.closeCommentForm()
        }

        this.isLoading = false
        // because of the watch or mounted part, the reply function gets execute very often
        // so after the submit of a comment there should happen nothing (scrollTo) for 2 sec
        this.$nextTick(() => {
          setTimeout(() => { this.$store.dispatch('comments/setSubmitting', false) }, 2000)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment-form-container {
    border-top: 1px solid $grey-lighter;
    margin-top: $margin-large;
    padding-top: $margin-large;
    display: flex;
  }

  .comment-form-aside {
    flex: 0 0 51px;
    width: 51px;
    padding-top: 5px;
  }

  .comment-form {
    flex: 1 1 0;
    // overflow: auto;
  }

  .comment-form-actions {
    padding-top: $padding-small;
    display: flex;
    justify-content: space-between;

    .button {
      width: 100%;

      @media (min-width: $tablet) {
        width: auto;
        min-width: 160px;
      }
    }
  }

</style>
