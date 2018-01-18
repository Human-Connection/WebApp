<template>
  <div class="card" :class="{ show: ready }">
    <div class="wrapper">
      <div class="contribution-link" @click="clicked" />
      <hc-progressive-image
          v-if="post.teaserImg"
          class="image"
          :preview="post.thumbnails.teaserImg.placeholder"
          :src="post.thumbnails.teaserImg.cardS"
          :srcset="srcset"
          @onPreview="imageLoaded" />
      <div class="content autowrap">
        <header>
          <div class="ribbon">
            <slot name="category"></slot>
          </div>
          <author :post="post"/>
          <div class="message is-danger is-small" v-if="!post.isEnabled">
            <div class="message-body">
              {{ $t('component.contribution.postDisabled') }}
            </div>
          </div>
          <h3 class="title is-4">
            <hc-truncate :text="post.title" length=70></hc-truncate>
            <slot name="header"></slot>
          </h3>
        </header>
        <main class="content">
          <hc-truncate :text="post.contentExcerpt" length=200></hc-truncate>
        </main>
        <footer>
          <div class="infos columns is-mobile">
            <div class="column has-text-left">
              <div class="tags " v-if="categories.length">
                <hc-tooltip :label="$t(`component.category.slug2label-${category.slug}`)"
                           v-for="category in categories"
                           :key="category._id"
                           style="margin-right: 5px;"
                           type="is-dark">
                    <span class="tag" style="border-radius: 100%; width: 32px; height: 32px; font-size: 1rem; opacity: 0.8;">
                      <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon>
                    </span>
                </hc-tooltip>
              </div>
            </div>
            <div class="column has-text-right">
              <span v-bind:title="$t('component.contribution.shoutsCountedDescription', {count: 214}, 214)" class="nowrap">
                <i class="fa fa-bullhorn"></i><small>{{ shoutCount }}</small>
              </span>
              <span v-bind:title="$t('component.contribution.commentsCountedDescription', {count: commentCount}, commentCount)" class="nowrap">
                <i class="fa fa-comments"></i><small>{{ commentCount }}</small>
              </span>
              <contribution-menu :post="post" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import Author from '~/components/Author/Author.vue'
  import ContributionMenu from '~/components/Contributions/ContributionMenu'
  import _ from 'lodash'

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
      ContributionMenu
    },
    data () {
      return {
        created: false,
        ready: false
      }
    },
    computed: {
      commentCount () {
        // we need to cast the comments array as it might be an object when only one is present
        return _.isEmpty(this.post.comments) ? 0 : _.castArray(this.post.comments).length
      },
      shoutCount () {
        // we need to cast the comments array as it might be an object when only one is present
        return _.isEmpty(this.post.shouts) ? 0 : _.castArray(this.post.shouts).length
      },
      categories () {
        return _.isEmpty(this.post.categories) ? [] : _.castArray(this.post.categories)
      },
      srcset () {
        return `${this.post.thumbnails.teaserImg.cardS} 300w, ${this.post.thumbnails.teaserImg.cardM} 400w, ${this.post.thumbnails.teaserImg.cardL} 720w`
      }
    },
    methods: {
      clicked () {
        this.$router.push(`/contributions/${this.post.slug}`)
        // this.$store.commit('unselectPost', this.post)
        // this.$store.commit('loadedPostWithSlug', this.post)
        // // tell router to show the post component, pass the slug
        // this.$router.push({name: 'contribution.contribution', params: {slug: this.post.slug}})
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
      if (!this.post.teaserImg) {
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

      z-index: 1;

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
    }

    &.timeline {
      width: 95%;
    }

    .content {
      padding: $padding;

      header {
        margin-bottom: 10px;
        margin-top: 0;
        pointer-events: none;
      }
    }

    main.content {
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

    footer {
      margin-top: 0;
      margin-bottom: -20px;
      padding-top: 0;
      padding-left: 0;
      padding-right: 0;
      text-align: left;
      border: none;

      .infos {
        color: #7f7f7f;
        small {
          padding-left: 3px;
        }
      }
    }
  }

  .ribbon {
    position:         absolute;
    font-size:        0.9em;
    font-weight:      bold;
    padding:          6px 6px;
    color:            #7e7e7e;
    background-color: #f9f9f9;
    right:            -7px;
    top:              10px;
    border-radius:    2px 0 0 2px;
    box-shadow:       $card-shadow;
    // border:           1px solid #ccc;

    &:before {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
      right: 0;
      bottom: -6px;
      border-width: 3px 4px 3px 3px;
      border-style: solid;
      border-color: #ccc transparent transparent #ccc;
    }
  }
</style>
