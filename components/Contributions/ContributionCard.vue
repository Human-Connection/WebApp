<template>
  <div class="hc__card" v-bind:class="{ show: ready }">
    <div class="hc__card__wrapper" @click="clicked">
      <img class="hc__card__image" v-if="post.teaserImg" :src="post.teaserImg" @load="imageLoaded"/>
      <div class="hc__card__content autowrap">
        <header>
          <slot name="category"></slot>
          <br/>
          <h3 class="title is-4">
            <hc-truncate :text="post.title" length=70></hc-truncate>
            <slot name="header"></slot>
          </h3>
        </header>
        <main class="content">
          <hc-truncate :text="post.contentExcerpt" length=200></hc-truncate>
        </main>
        <footer>
          <author :post="post"/>
          <br/>
          <span><i class="fa fa-bullhorn"></i> 214&nbsp;&nbsp;<i class="fa fa-comments"></i> {{ commentCount }}</span>
        </footer>
      </div>
    </div>
  </div>
</template>


<script>
  import author from '~components/Author/Author.vue'

  export default {
    name: 'hc-contribution-card',
    props: ['post'],
    components: {
      'author': author
    },
    data () {
      return {
        ready: false
      }
    },
    computed: {
      commentCount () {
        const count = this.post.comments ? this.post.comments.length : 0
        return (count === undefined) ? 0 : count
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
        this.$emit('ready')
        this.ready = true
      }
    },
    mounted () {
      if (!this.post.image) {
        // show the card when you do not have to load an image before
        setTimeout(() => {
          this.ready = true
        }, 50)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/styles/utilities';

  $gutter: 15px;
  $gutter-big: 20px;
  $padding: 25px;

  .hc__card {
    display: block;
    width: 100%;
    max-width: 100%;
    @include tablet() {
      width: ($tablet - 1*$gutter - $container-gutter) / 2;
    }
    @include desktop() {
      width: ($desktop - 2*$gutter - $container-gutter) / 3;
    }
    @include widescreen() {
      width: ($widescreen - 2*$gutter-big - $container-gutter) / 3;
    }
    @include fullhd() {
      width: ($fullhd - 2*$gutter-big - $container-gutter) / 3;
    }

    opacity: 0;
    transition-duration: 0ms;
    transition: opacity 150ms;
    transition-delay: 150ms;
    &.show {
      opacity: 1;
    }

    .hc__card__wrapper {
      background-color: #fff;
      cursor: pointer;
      transition: box-shadow 100ms;

      &:hover {
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      }
    }

    .hc__card__content {
      padding: $padding;

      header {
        margin-bottom: 10px;
      }
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

    .hc__card__image {
      display: block;
    }

    footer {
      margin-top: 20px;
      margin-bottom: -20px;

      .profile-image {
        width: 36px;
        height: 36px;
        background-position: center;
        background-size: cover;
      }
    }
  }
</style>
