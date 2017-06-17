<template>
    <div class="comments" v-if="post">
        <div class="comment" v-for="comment in post.comments">
            <p>{{ comment.contentExcerpt }}</p>
            <author :post="comment"></author>
        </div>
        <comment-form :post="post" />
    </div>
</template>


<script>
  import feathers from '~plugins/feathers'
  import author from '../Author.vue'
  import commentForm from './CommentForm.vue'

  export default {
    props: ['post'],
    components: {
      'author': author,
      'comment-form': commentForm
    },
    data () {
      return {
        comments: false
      }
    },
    mounted () {
      let app = this
      feathers.service('comments')
        .on('created', comment => {
          if (comment.contributionId === app.post._id) {
            app.comments = app.comments ? app.comments : app.post.comments
            app.comments.push(comment)
          }
        })
    }
  }
</script>

<style>
    .profile-image {
        border: 1px solid #ccc
    }

    small {
        display:        block;
        text-align:     center;
        text-transform: uppercase;
        padding:        5px 10px;
        margin:         0 auto;
    }

    .profile-image {
        width:               36px;
        height:              36px;
        background-position: center;
        background-size:     cover;
    }

    .img-circle {
        border-radius: 50%;
    }
</style>
