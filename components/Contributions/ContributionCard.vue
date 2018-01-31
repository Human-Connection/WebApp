<template>
  <div class="card" :class="{ show: ready }">
    <div class="wrapper">
      <div class="contribution-link" @click="clicked" />
      <hc-progressive-image
          v-if="post.teaserImg && post.thumbnails"
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
          <author :post="post" class="author"/>
          <div class="message is-danger is-small" v-if="!post.isEnabled">
            <div class="message-body">
              <i class="fa fa-eye-slash"></i> &nbsp;<span>{{ $t('component.contribution.postDisabled') }}</span>
            </div>
          </div>
          <h3 class="title is-4">
            <hc-truncate :text="post.title" length=70></hc-truncate>
            <slot name="header"></slot>
          </h3>
        </header>
        <article class="content">
          <hc-truncate :text="post.contentExcerpt" length=200></hc-truncate>
        </article>
        <contribution-card-footer :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
  import Author from '~/components/Author/Author.vue'
  import ContributionCardFooter from '~/components/Contributions/ContributionCardFooter'

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
      ContributionCardFooter
    },
    data () {
      return {
        created: false,
        ready: false
      }
    },
    computed: {
      srcset () {
        if (!this.post || !this.post.thumbnails || !this.post.thumbnails.teaserImg) {
          return ''
        }
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
      z-index: 1;
    }

    &.timeline {
      width: 95%;
    }

    .content {
      padding: $padding;

      header {
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

  .author {
    z-index: 2;
    position: relative;
  }
</style>
