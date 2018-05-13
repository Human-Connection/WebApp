<template>
  <div class="card" :class="{ show: ready }" role="article">
    <div class="wrapper">
      <a :href="$router.resolve(detailLink).href"
         @click="onDetail"
         class="contribution-link" >{{ post.title }}</a>
      <hc-progressive-image
          v-if="post.teaserImg && post.thumbnails"
          class="image"
          :preview="post.thumbnails.teaserImg.placeholder"
          :src="post.thumbnails.teaserImg.cardS"
          :srcset="srcset"
          :alt="post.title"
          @onPreview="imageLoaded">
        <div v-if="post && post.meta && post.meta.hasVideo"
             class="player-icon">
          <img
              alt="contribution contains video"
              src="/assets/images/media/play-light.png"
              srcset="/assets/images/media/play-light.png 2x, /assets/images/media/play-light.png 1x" />
        </div>
      </hc-progressive-image>
      <div class="content autowrap">
        <header>
          <div class="ribbon">
            <small>{{ $t('component.contribution.type-' + post.type) }}</small>
          </div>
          <author :user="post.organization || post.user"
            :created-at="post.createdAt" />
          <div class="message is-danger is-small" v-if="!post.isEnabled">
            <div class="message-body">
              <i class="fa fa-eye-slash"></i> &nbsp;<span>{{ $t('component.contribution.postDisabled') }}</span>
            </div>
          </div>
          <div class="message is-warning is-small" v-if="!post.categoryIds.length">
            <div class="message-body">
              <i class="fa fa-eye-slash"></i> &nbsp;<span>{{ $t('component.contribution.postPrivate') }}</span>
            </div>
          </div>
          <h3 class="title is-4">
            <hc-truncate :text="post.title" length=70></hc-truncate>
            <slot name="header"></slot>
          </h3>
        </header>
        <article class="content">
          <contribution-card-can-do :post="post" v-if="isCanDo" />
          <hc-truncate :text="post.contentExcerpt" length=200 v-else />
        </article>
        <contribution-card-footer :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
  import Author from '~/components/Author/Author.vue'
  import ContributionCardCanDo from '~/components/Contributions/ContributionCardCanDo'
  import ContributionCardFooter from '~/components/Contributions/ContributionCardFooter'
  import thumbnailHelper from '~/helpers/thumbnails'

  export default {
    name: 'hc-contribution-card',
    props: {
      post: {
        type: Object,
        required: true
      },
      inViewportOffset: {
        type: Number,
        default: 250
      }
    },
    components: {
      Author,
      ContributionCardFooter,
      ContributionCardCanDo
    },
    data () {
      return {
        created: false,
        ready: false
      }
    },
    computed: {
      srcset () {
        return thumbnailHelper.srcSetFromThumbnails(this.post, 'teaserImg', ['cardS', 'cardM', 'cardL'])
      },
      isCanDo () {
        if (this.post.type !== 'cando') {
          return null
        }
        return !!this.post.cando
      },
      detailLink () {
        return `/contributions/${this.post.slug}`
      }
    },
    methods: {
      onDetail (e) {
        if (!e.metaKey && !e.ctrlKey) {
          // do open detail page without reload if no extra keys are specefied
          e.preventDefault()
          this.$router.push(this.detailLink)
        }
      },
      imageLoaded () {
        // show card after the image has been loaded
        this.$nextTick(() => {
          this.ready = true
          this.$emit('ready')
        })
      }
    },
    mounted () {
      this.created = true
      if (this.post && !this.post.teaserImg) {
        // show the card when you do not have to load an image before
        setTimeout(() => {
          this.$nextTick(() => {
            this.ready = true
          })
        }, 50)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  $gutter: 15px;
  $gutter-big: 20px;
  $padding: 25px;

  .player-icon {
    & > img {
      width: 70px;
      height: 70px;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .progressive {
    img.preview {
      filter: none !important;
    }
  }

  .card {

    /*opacity: .5;
    transition: opacity 150ms;

    .wrapper {
      visibility: hidden;
    }
    &[v-cloak] {
      opacity: 1;

      .wrapper {
        visibility: visible;
      }
    }*/

    display: block;
    width: 100%;
    max-width: 100%;
    @include tablet() {
      width: ($tablet - 1 * $gutter - $container-gutter) / 2;
    }
    @include desktop() {
      width: ($desktop - 2 * $gutter - $container-gutter) / 3;
    }
    @include widescreen() {
      width: ($widescreen - 2 * $gutter-big - $container-gutter) / 3;
    }
    @include fullhd() {
      width: ($fullhd - 2 * $gutter-big - $container-gutter) / 3;
    }
    box-shadow: $card-shadow;
    // box-shadow: none;

    opacity: 0;

    &, & wrapper {
      transition: opacity 50ms;
      transition-delay: 50ms;
    }

    &[data-packed] {
      opacity: .5;
    }

    &.show {
      opacity: 1;

      .wrapper {
        opacity: 1;
      }
    }

    .wrapper {
      opacity: 0;
      background-color: #fff;
      cursor: pointer;
      transition: box-shadow 150ms ease-out, transform 150ms ease-out;
      position: relative;

      @include tablet() {
        &:hover {
          box-shadow: $card-shadow-hover;
          // transform: scale(1.02);
          z-index: 2;
        }
      }
    }

    .contribution-link {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      text-indent: -99999px;
      z-index: 1;
    }

    &.timeline {
      width: 95%;
    }

    .content {
      padding: $padding;

      header {
        position: relative;
        margin-bottom: 10px;
        margin-top: 0;
      }
    }

    article.content {
      padding: 0;
    }

    .profile-image {
      border: 1px solid #ccc
    }

    small {
      text-align: center;
      text-transform: uppercase;
      padding: 5px 10px;
      margin: 0 auto;
    }

    .image {
      display: inline-block;
      width: 100%;
    }

    .profile-image {
      width: 36px;
      height: 36px;
      background-position: center;
      background-size: cover;
    }
  }

  .message {
    margin-top: 2em;
  }

  .ribbon {

    $ribbonColor: lighten(desaturate(#005093, 50%), 25%);
    $ribbonColorDark: darken($ribbonColor, 20%);

    position:         absolute;
    font-size:        0.9em;
    font-weight:      bold;
    padding:          6px 6px;
    color:            #fff;
    background-color: $ribbonColor;
    right:            -32px;
    top:              -5px;
    border-radius:    2px 0 0 2px;
    box-shadow:       $card-shadow;
    z-index:          11;
    // border:           1px solid #ccc;

    &:before {
      content: " ";
      position: absolute;
      width: 0;
      height: 0;
      right: 0;
      bottom: -6px;
      border-width: 3px 4px 3px 3px;
      border-style: solid;
      border-color: $ribbonColorDark transparent transparent $ribbonColorDark;
    }
  }

  .author {
    z-index: 2;
    position: relative;
  }
</style>
