<template>
  <div class="hc__comments">
    <transition-group name="comment" v-if="comments.length >= 1">
      <div class="hc__comment autowrap" v-for="comment in comments" :key="comment._id">
        <author :post="comment"></author>
        <p v-html="comment.content"></p>
      </div>
    </transition-group>
    <div v-else class="notification">
      <br/>
      <strong><hc-emoji type="surprised" width="20" style="display: inline-block; margin-bottom: -0.3rem;" /> &nbsp; No comments yet, you sould write some!</strong>
    </div>
    <comment-form :post="post"/>
  </div>
</template>


<script>
  import feathers from '~/plugins/feathers'
  import author from '~/components/Author/Author.vue'
  import commentForm from '~/components/Comments/CommentForm.vue'
  import _ from 'lodash'

  export default {
    name: 'hc-comment',
    props: ['post'],
    components: {
      'author': author,
      'comment-form': commentForm
    },
    data () {
      return {
        comments: []
      }
    },
    created () {
      if (!_.isEmpty(this.post.comments)) {
        // we need to cast the comments array as it might be an object when only one is present
        this.comments = _.castArray(this.post.comments)
      }
    },
    mounted () {
      feathers.service('comments')
        .on('created', comment => {
          if (comment.contributionId === this.post._id) {
            this.comments.push(comment)
            this.$store.dispatch('layout/change')
          }
        })
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .hc__comment {
    border-top: 1px solid $grey-lighter;
    padding: 20px 0;
    position: relative;

    p {
      color: $grey;
      padding-left: 51px;
    }

    &:first-child {
      border-top: none;
    }
  }

  .comment-enter-active, .comment-leave-active {
    transition: all .5s ease-out;
  }

  .comment-enter, .comment-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
</style>
