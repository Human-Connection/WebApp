<template>
    <div class="hc__card" v-bind:class="{ show: ready }">
        <div class="hc__card__wrapper" @click="clicked">
            <img class="hc__card__image" v-if="post.teaserImg" :src="post.teaserImg" @load="imageLoaded"/>
            <div class="hc__card__content">
                <header>
                    <slot name="category"></slot>
                    <br/>
                    <h3 class="title is-4">
                        <truncate :text="post.title" length=70></truncate>
                        <slot name="header"></slot>
                    </h3>
                </header>
                <main class="content">
                    <truncate :text="post.contentExcerpt" length=200></truncate>
                </main>
                <footer>
                    <author :post="post"/>
                    <br/>
                    <span><i class="fa fa-bullhorn"></i> 214&nbsp;&nbsp;<i class="fa fa-comments"></i> {{ post.comments.length }}</span>
                </footer>
            </div>
        </div>
    </div>
</template>


<script>
  import truncate from './Truncate.vue'
  import author from './Author.vue'

  export default {
    props: ['post'],
    components: {
      'author': author,
      'truncate': truncate
    },
    data () {
      return {
        ready: false
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
    @import '../assets/styles/utilities';

    .hc__card {
        $padding: 25px;
        display:             block;
        width:               100%;
        max-width:           100%;
        @include tablet() {
            width: 345px;
        }
        @include desktop() {
            width: 300px;
        }
        @include fullhd() {
            width: 300px;
        }

        opacity:             0;
        transition-duration: 0ms;
        transition:          opacity 250ms;
        &.show {
            opacity: 1;
        }

        .hc__card__wrapper {
            background-color: #fff;
            cursor:           pointer;
            transition:       box-shadow 100ms;

            &:hover {
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
        }

        .hc__card__content {
            padding: $padding;

            header {
                margin-bottom:10px;
            }
        }

        .profile-image {
            border: 1px solid #ccc
        }

        small {
            text-align:     center;
            text-transform: uppercase;
            padding:        5px 10px;
            margin:         0 auto;
        }

        .hc__card__image {
            display: block;
        }

        footer {
            margin-top: 20px;
            margin-bottom: -20px;

            .profile-image {
                width:               36px;
                height:              36px;
                background-position: center;
                background-size:     cover;
            }
        }
    }
</style>
