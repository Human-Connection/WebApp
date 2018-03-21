<template>
  <div class="comments" :key="post._id">
    <div v-if="isLoading" class="notification">
      <strong>{{ $t('component.contribution.commentsLoading', 'Loading Comments...') }}</strong>
    </div>
    <transition-group v-else-if="comments.length >= 1" name="comment" tag="div">
      <comment v-for="comment in comments" :key="comment._id" :comment="comment" :onUpvote="upvote"></comment>
    </transition-group>
    <div v-else class="notification">
      <br/>
      <strong><hc-emoji type="surprised" width="20" style="display: inline-block; margin-bottom: -0.3rem;" /> &nbsp; {{ $t('component.contribution.commentsNoneYet', 'No comments yet, you can write some!') }}</strong>
    </div>
    <comment-form :post="post"/>
  </div>
</template>


<script>
  import {mapGetters} from 'vuex'
  import comment from '~/components/Comments/Comment.vue'
  import commentForm from '~/components/Comments/CommentForm.vue'

  export default {
    name: 'hc-comments',
    props: ['post'],
    components: {
      'comment': comment,
      'comment-form': commentForm
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        comments: 'comments/all',
        isLoading: 'comments/isLoading'
      })
    },
    destroyed () {
      this.$store.commit('comments/clear')
    },
    methods: {
      upvote (comment) {
        if (!this.user) {
          this.$router.push({ name: 'auth-login', params: { path: this.$route.path } })
        } else {
          this.$store.dispatch('comments/upvote', comment)
        }
      }
    },
    mounted () {
      this.$store.dispatch('comments/fetchByContributionId', this.post._id)
      this.$store.dispatch('comments/subscribe', this.post._id)
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment-enter-active, .comment-leave-active {
    transition: all .5s ease-out;
  }

  .comment-enter, .comment-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
</style>
