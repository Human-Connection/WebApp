<template>
    <div class="columns">
        <div class="column is-8 is-offset-2">
            <div class="card">
                <section class="section">
                    <div class="content">
                        <div class="text-center hc__imagecontainer" v-if="contribution.teaserImg">
                            <img :src="contribution.teaserImg" :alt="contribution.titel" style="display:block; width: 100%;"/>
                        </div>
                        <author :post="contribution" v-cloak></author>
                        <h1>{{ contribution.title }}</h1>
                        <p>{{ contribution.content || contribution.contentExcerpt}}</p>
                        <h3>What do you feel?</h3>
                        <div class="hc__rating">
                            <img src="/assets/svg/hc-smilies-01.svg"/>
                            <img src="/assets/svg/hc-smilies-02.svg"/>
                            <img src="/assets/svg/hc-smilies-03.svg"/>
                            <img src="/assets/svg/hc-smilies-04.svg"/>
                            <img src="/assets/svg/hc-smilies-05.svg"/>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>


<script>
  import author from '../../components/Author.vue'
  import feathers from '~plugins/feathers'

  export default{
    components: {
      'author': author
    },
    data () {
      return {
        contribution: null,
        title: null
      }
    },
    async asyncData ({params, error}) {
      try {
        let res = await feathers.service('contributions').get(null, {
          query: {
            slug: params.slug
          }
        })
        if (!res.title) {
          error({statusCode: 404, message: 'Post not found'})
        }
        return {
          contribution: res,
          title: res.title
        }
      } catch (error) {
        console.error(error.message)
        error({statusCode: 500, message: error.message})
        return {}
      }
    },
    head () {
      return {
        title: this.title
      }
    }
//    preFetch (store, route) {
//      return this.methods.loadPost(store, route)
//    },
//    computed: {
//      post () {
//        try {
//          return this.$store.state.contribution.post
//        } catch (error) {
//          console.log(error)
//          return null
//        }
//      }
//    },
//    activated () {
//      this.loadPost(this.$store, this.$route)
//    },
//    methods: {
//      // load the post
//      loadPost (store, route) {
//        // get slug url parameter from router
//        var slug = route.params.slug
//        if (slug) {
//          // only load post when not already loaded
//          if (store.state.contribution.post) {
//            if (!store.state.contribution.post.slug === slug || !store.state.contribution.post.content) {
//              // tell the store to load the post
//              return store.dispatch('loadPostBySlug', slug)
//            }
//          } else {
//            return store.dispatch('loadPostBySlug', slug)
//          }
//        }
//      }
//    }
  }
</script>


<style lang="scss">
    .hc__imagecontainer {
        height:   300px;
        overflow: hidden;
        margin:   -3rem -1.5rem 1.5rem;
    }
    .hc__rating {
        margin-top: 1rem;
        height: 50px;
        img {
            float: left;
            margin-right: 10px;
            height: 50px;
        }

        &:after {
            clear: both;
        }
    }
</style>
