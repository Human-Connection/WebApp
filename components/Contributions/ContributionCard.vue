<template>
  <div class="card" v-bind:class="{ show: ready }">
    <div class="wrapper" @click="clicked">
      <img class="image" v-if="post.teaserImg" :src="post.teaserImg" @load="imageLoaded"/>
      <div class="content autowrap">
        <header>
          <div class="ribbon">
            <slot name="category"></slot>
          </div>
          <author :post="post"/>
          <h3 class="title is-5">
            <hc-truncate :text="post.title" length=70></hc-truncate>
            <slot name="header"></slot>
          </h3>
        </header>
        <div class="tags" v-if="post.categories && post.categories.length">
          <span class="tag is-primary" v-for="contribution in post.categories">
            {{ contribution.title }}
          </span>
        </div>
        <main class="content">
          <hc-truncate :text="post.contentExcerpt" length=200></hc-truncate>
        </main>
        <footer>
          <div class="infos">
            <span>
              <i class="fa fa-bullhorn"></i><small>214</small>
            </span>
            <span>
              <i class="fa fa-comments"></i><small>{{ commentCount }}</small>
            </span>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>


<script>
  import author from '~/components/Author/Author.vue'

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
  @import 'assets/styles/utilities';

  $gutter: 15px;
  $gutter-big: 20px;
  $padding: 25px;

  .card {
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
    // box-shadow: 0 0 3px rgba(10, 10, 10, 0.2);
    box-shadow: none;

    opacity: 0;
    transition-duration: 0ms;
    transition: opacity 150ms;
    transition-delay: 150ms;
    border: 1px solid rgba(black, 0.15);

    &.show {
      opacity: 1;
    }
    .wrapper {
      background-color: #fff;
      cursor: pointer;
      transition: box-shadow 250ms ease-in-out, transform 250ms ease-in-out;
      position: relative;

      z-index: 1;

      &:hover {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        transform: scale(1.02);
        z-index: 2;
      }
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

    main.content {
      padding: 0;
      line-height: 1.2em;
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
      display: block;
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
    box-shadow: 0 1px 3px rgba(10, 10, 10, 0.1);
    border:           1px solid #ccc;

    &:before {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
      right: -1px;
      bottom: -7px;
      border-width: 3px 4px 3px 3px;
      border-style: solid;
      border-color: #ccc transparent transparent #ccc;
    }
  }
</style>
