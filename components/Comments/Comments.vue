<template>
  <div class="comments autowrap-force" :key="post._id">
    <div v-if="isLoading" class="notification">
      <strong>{{ $t('component.contribution.commentsLoading', 'Loading Comments...') }}</strong>
    </div>
    <transition-group v-else-if="comments.length >= 1" name="comment" tag="div">
      <hc-comment @reply="onReply"
               v-for="comment in replyComments"
               :isAuthor="comment.userId === post.userId"
               :isOwner="comment.userId === user._id"
               :key="comment._id"
               :comment="comment"
               :post="post"
               v-on:input="editorText"
               :onUpvote="upvote" />
    </transition-group>
    <div v-if="commentCount > (comments.length + childCommentCount)">
      <hc-button
        @click="loadMoreComments"
        class="button is-info is-fullwidth"
        :class="{ 'is-loading': isLoading }">
        {{ $t('button.showMoreComments', {'count': commentCount - (comments.length + childCommentCount)}) }}
      </hc-button>
    </div>
    <!--<div v-else class="notification">
      <br/>
      <strong><hc-emoji type="surprised" width="20" style="display: inline-block; margin-bottom: -0.3rem;" /> &nbsp; {{ $t('component.contribution.commentsNoneYet', 'No comments yet, you can write some!') }}</strong>
    </div>-->
    <hc-comment-form id="comment-form" :post="post" :replyComment="replyComment" :isCommentFormOfContribution="true" v-on:input="editorText"/>
  </div>
</template>


<script>
  import {mapGetters} from 'vuex'
  import comment from '~/components/Comments/Comment.vue'
  import commentForm from '~/components/Comments/CommentForm.vue'
  import button from '~/components/Global/Elements/Button/Button.vue'

  export default {
    name: 'hc-comments',
    props: ['post'],
    components: {
      'hc-comment': comment,
      'hc-comment-form': commentForm,
      'hc-button': button
    },
    data () {
      return {
        replyComment: null
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        comments: 'comments/all',
        commentCount: 'comments/count',
        childCommentCount: 'comments/childCount',
        isLoading: 'comments/isLoading'
      }),
      replyComments: function() {
        return this.comments.filter((c) => { return !c.parentCommentId; })
      }
    },
    destroyed () {
      this.$store.commit('comments/clear')
    },
    methods: {
      editorText (newText) {
        this.$emit('input', newText)
      },
      upvote (comment) {
        if (!this.user) {
          this.$router.push({ name: 'auth-login', params: { path: this.$route.path } })
        } else {
          this.$store.dispatch('comments/upvote', comment)
        }
      },
      onReply (comment) {
        this.replyComment = comment
        this.$nextTick(() => this.replyComment = null)
      },
      loadMoreComments () {
        this.$store.dispatch('comments/fetchAllByContributionId', this.post._id)
      }
    },
    mounted () {
      this.$store.dispatch('comments/fetchByContributionId', this.post._id)
        .then(() => {
          // load more comments if queried comment is not on this page yet
          if (this.$route.query && this.$route.query.showComment) {
            let comment = this.comments.find(comment => comment._id === this.$route.query.showComment)

            if (! comment) {
              this.loadMoreComments()
            }
          }
        })
        .catch((e) => {console.log(e)})

      this.$store.dispatch('comments/subscribe', this.post._id)
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comments {
    margin-top: $margin;
  }

  .comment-enter-active, .comment-leave-active {
    transition: all .5s ease-out;
  }

  .comment-enter, .comment-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
</style>
