<template>
  <div class="comment is-unselectable autowrap">
    <div class="columns is-mobile">
      <div class="column">
        <author :post="comment"></author>
      </div>
      <div class="column has-text-right">
        <hc-tooltip :label="$t('component.contribution.commentUpvote')" type="is-black" position="is-left">
          <a @click="onUpvote(comment)" style="border: none; text-decoration: none; color: #666">
            <small v-if="comment.upvoteCount > 0"><strong>+{{ comment.upvoteCount || 0 }}</strong></small>&nbsp;
            <i class="fa fa-angle-double-up"></i>&nbsp;
          </a>
        </hc-tooltip>
      </div>
    </div>
    <p v-html="getText"></p>
    <div class="columns is-mobile" style="padding-top: 1rem; padding-left: 3.5rem;">
      <div class="column" style="padding-top: 1rem;">
        <nav class="level is-mobile">
          <div class="level-left">
            <hc-tooltip :label="$t('component.contribution.commentReplyThis')" type="is-black" position="is-right">
              <a class="level-item" style="cursor: not-allowed; pointer-events: visible;">
                <span class="icon is-small"><i class="fa fa-reply"></i></span>
              </a>
            </hc-tooltip>
          </div>
        </nav>
      </div>
      <div class="column has-text-right">
        <a v-if="isTruncated" @click="toggleText" class="is-small">
          <span v-if="!fullContentShown">{{ $t('button.showMore', 'Mehr') }} <i class="is-small fa fa-angle-down"></i></span>
          <span v-else>{{ $t('button.showLess', 'Weniger') }} <i class="is-small fa fa-angle-up"></i></span>
          &nbsp;
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import author from '~/components/Author/Author.vue'

  export default {
    name: 'hc-comment',
    props: {
      onUpvote: {
        type: Function,
        required: true
      },
      comment: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        fullContentShown: false
      }
    },
    components: {
      'author': author
    },
    computed: {
      getText () {
        return (this.fullContentShown && this.content) ? this.content : this.comment.contentExcerpt
      },
      isTruncated () {
        return this.getText.slice(-3) === '...' || this.fullContentShown
      }
    },
    methods: {
      toggleText () {
        if (this.content) {
          this.fullContentShown = !this.fullContentShown
        } else {
          this.$store.dispatch('comments/fetchById', this.comment._id)
            .then((res) => {
              this.content = res.content
              this.fullContentShown = !this.fullContentShown
            })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment {
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
