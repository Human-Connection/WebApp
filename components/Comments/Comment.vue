<template>
  <div class="comment autowrap" :class="{ highlight: highlight }">
    <div class="columns is-mobile">
      <div class="column">
        <author :user="comment.user"
          :created-at="comment.createdAt" />
      </div>
      <div class="column has-text-right">
        <hc-tooltip :label="$t('component.contribution.commentUpvote')" type="is-black" position="is-left">
          <a @click.once="onUpvote(comment)" style="border: none; text-decoration: none; color: #666">
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
  import linkifyHtml from 'linkifyjs/html'

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
        fullContentShown: false,
        highlight: false
      }
    },
    components: {
      'author': author
    },
    computed: {
      getText () {
        return (this.fullContentShown && this.content) ? linkifyHtml(this.content) : linkifyHtml(this.comment.contentExcerpt)
      },
      isTruncated () {
        if (this.comment.hasMore === undefined) {
          // old logic
          return this.getText.slice(-3) === '...' || this.getText.slice(-1) === '…' || this.fullContentShown
        } else {
          // new logic
          return this.comment.hasMore
        }
      }
    },
    mounted () {
      this.scrollToCommentIfSelected()
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
      },
      scrollToCommentIfSelected () {
        // check if ?showComment is set and scroll to the selected comment item if the id mataches
        if (this.$route.query && this.$route.query.showComment === this.comment._id) {
          setTimeout(() => {
            this.$scrollTo(this.$el, 500, {
              onDone: () => {
                this.highlight = true
              }
            })
          }, 100)
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

    &.highlight {
      animation: highlight-animation;
      animation-duration: 1500ms;
      transition: background-color ease-out;
    }
  }

  .comment-enter-active, .comment-leave-active {
    transition: all .5s ease-out;
  }

  .comment-enter, .comment-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }

  @keyframes highlight-animation {
    0% {
      background-color: $yellow;
    }
    20% {
      background-color: transparent;
    }
    40% {
      background-color: $yellow;
    }
    60% {
      background-color: $yellow;
    }
    100% {
      background-color: transparent;
    }
  }
</style>
