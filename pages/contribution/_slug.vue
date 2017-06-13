<template>
    <div>
        <section v-if="contribution" class="section">
            <div class="content">
                <div class="text-center" style="height: 300px; overflow: hidden;" v-if="contribution.teaserImg">
                    <img :src="contribution.teaserImg" :alt="contribution.titel" style="display:block; width: 100%;"/>
                </div>
            </div>
            <div class="content">
                <author :contribution="contribution" v-cloak></author>
            </div>
            <h1 class="title">{{ contribution.title }}</h1>
            <div class="content">
                <p>{{ contribution.content || contribution.contentExcerpt}}</p>
            </div>
            <div class="loader" v-if="!contribution">Loading...</div>
        </section>
        <section v-else class="section">
            <h1 class="title is-1">NOTHING HERE</h1>
            <h3 class="title is-3">time will show</h3>
        </section>
    </div>
</template>


<script>
  import author from '../../components/Author.vue'
  import axios from 'axios'

  export default{
    components: {
      'author': author
    },
    data () {
      return {
        contribution: null
      }
    },
    async asyncData ({params}) {
      try {
        let {data} = await axios.get(`/api/contributions/${params.slug}`)
        return {
          contribution: data
        }
      } catch (error) {
        console.error(error)
        return {}
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


<style>

</style>
