<template>
  <div class="comment autowrap" :class="{ highlight: highlight }">
    <div class="comment-aside">
      <author :user="comment.user"
        :showText="false" />
    </div>
    <div class="comment-main">
      <div class="comment-header">
        <div class="comment-header-author">
          <author :user="comment.user"
            :showAvatar="false" />
        </div>
        <div class="comment-header-actions">
          <hc-tooltip :label="$t('component.contribution.commentUpvote')" type="is-black" position="is-left">
            <a @click.once="onUpvote(comment)" style="border: none; text-decoration: none; color: #666">
              <small v-if="comment.upvoteCount > 0"><strong>+{{ comment.upvoteCount || 0 }}</strong></small>&nbsp;
              <i class="fa fa-angle-double-up"></i>&nbsp;
            </a>
          </hc-tooltip>
        </div>
      </div>
      <div v-html="getText" class="comment-text"></div>
      <div class="comment-footer">
        <div class="comment-footer-actions-left">
          <hc-tooltip :label="$t('component.contribution.commentReplyThis')" type="is-black" position="is-right">
            <a class="level-item" style="cursor: not-allowed; pointer-events: visible;">
              <span class="icon is-small"><i class="fa fa-reply"></i></span>
            </a>
          </hc-tooltip>
        </div>
        <div class="comment-footer-actions-right">
          <a v-if="isTruncated" @click="toggleText" class="is-small">
            <span v-if="!fullContentShown">{{ $t('button.showMore', 'Mehr') }} <i class="is-small fa fa-angle-down"></i></span>
            <span v-else>{{ $t('button.showLess', 'Weniger') }} <i class="is-small fa fa-angle-up"></i></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import author from '~/components/Author/Author.vue'
  import linkifyHtml from 'linkifyjs/html'
  import HcAvatar from "../Global/Elements/Avatar/Avatar.vue";

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
      HcAvatar,
      'author': author
    },
    computed: {
      getText () {
        return (this.fullContentShown && this.content)
          ? linkifyHtml(this.content)
          : linkifyHtml(this.comment.contentExcerpt)
      },
      isTruncated () {
        return this.getText.slice(-3) === '...' ||
          this.getText.slice(-1) === '…' ||
          this.getText.slice(-7) === '...</p>' ||
          this.getText.slice(-5) === '…</p>' ||
          this.fullContentShown
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
    margin-bottom: $margin;
    position: relative;
    display: flex;

    &.highlight {
      animation: highlight-animation;
      animation-duration: 1500ms;
      transition: background-color ease-out;
    }
  }

  .comment-aside {
    flex: 0 0 51px;
    width: 51px;
    padding-top: 10px;
  }

  .comment-main {
    position: relative;
    flex: 1 1 0;
    overflow: auto;
    padding: $padding-small;
    background-color: $white;

    &:before {
      position: absolute;
      content: '';
      display: block;
      top: 20px;
      right: 100%;
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid $white;
    }
  }

  .comment-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: $margin-small;
  }

  .comment-footer {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: $margin-small;
  }

  .comment-text {
    color: $grey;
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
