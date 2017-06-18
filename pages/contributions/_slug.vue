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
                        <p class="content" v-html="content"></p>
                        <h3>What do you feel?</h3>
                        <div class="hc__rating">
                            <img src="/assets/svg/hc-smilies-01.svg"/>
                            <img src="/assets/svg/hc-smilies-02.svg"/>
                            <img src="/assets/svg/hc-smilies-03.svg"/>
                            <img src="/assets/svg/hc-smilies-04.svg"/>
                            <img src="/assets/svg/hc-smilies-05.svg"/>
                        </div>
                    </div>
                    <b-tabs class="footer">
                        <b-tab-item v-bind:label="'Comments (' + contribution.comments.length + ')'">
                            <comments :post="contribution"/>
                        </b-tab-item>
                        <b-tab-item label="Versus">
                            Versus
                        </b-tab-item>
                        <b-tab-item label="Can Do">
                            Can Do
                        </b-tab-item>
                    </b-tabs>
                </section>
            </div>
        </div>
    </div>
</template>


<script>
  import author from '../../components/Author.vue'
  import feathers from '~plugins/feathers'
  import comments from '../../components/Comments/Comments.vue'

  export default{
    components: {
      'author': author,
      'comments': comments
    },
    data () {
      return {
        contribution: null,
        title: null
      }
    },
    async asyncData ({params, error}) {
      try {
        let res = await feathers.service('contributions').find({
          query: {
            slug: params.slug
          }
        })
        return {
          contribution: res.data[0],
          title: res.data[0].title
        }
      } catch (err) {
        error({statusCode: err.code || 500, message: err.message})
        return {}
      }
    },
    computed: {
      content () {
        const txt = this.contribution.content || this.contribution.contentExcerpt
        return txt.replace(/(\r\n|\n\r|\r|\n)/g, '<br>$1')
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


<style scoped lang="scss">
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
    .b-tabs.footer {
        padding-top: 10px;
        padding-bottom: 40px;
    }
</style>
