<template>
    <div class="hc__comments" v-if="post">
        <transition-group name="comment">
            <div class="hc__comment autowrap" v-for="comment in comments" :key="comment._id">
                <author :post="comment"></author>
                <p v-html="comment.content"></p>
            </div>
        </transition-group>
        <comment-form :post="post" />
    </div>
</template>


<script>
  import feathers from '~plugins/feathers'
  import author from '~components/Author.vue'
  import commentForm from './CommentForm.vue'

  export default {
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
      if (this.post.comments) {
        this.comments = this.post.comments
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
    @import "../../assets/styles/utilities";

    .hc__comment {
        border-top:1px solid $grey-lighter;
        padding: 20px 0;
        position:relative;

        p {
            color: $grey;
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
