<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">
      <div class="card">
        <section class="section">
          <div class="content autowrap">
            <div class="text-center hc__imagecontainer" v-if="contribution.teaserImg">
              <img :src="contribution.teaserImg" :alt="contribution.titel" style="display:block; width: 100%;"/>
            </div>
            <div class="columns">
              <div class="column">
                <author :post="contribution"></author>
              </div>
              <div class="column">
                <nuxt-link v-if="canEdit" class="button pull-right" :to="{ path: `/contributions/edit/${contribution.slug}` }">
                  Edit
                </nuxt-link>
              </div>
            </div>
            <h1>{{ contribution.title }}</h1>
            <p v-if="contribution.categories && contribution.categories.length">
              <span class="tag is-primary" v-for="contribution in contribution.categories">
                {{ contribution.title }}
              </span>
            </p>
            <p class="content" v-html="content"></p>
            <hc-emotion-rating :contribution="contribution" :user="user"></hc-emotion-rating>
          </div>
          <b-tabs class="footer">
            <b-tab-item v-bind:label="'Comments (' + commentCount + ')'">
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
  import author from '~components/Author/Author.vue'
  import feathers from '~plugins/feathers'
  import comments from '~components/Comments/Comments.vue'
  import {mapGetters} from 'vuex'
  import EmotionRating from '~components/Contributions/EmotionRating.vue'

  export default {
    components: {
      'author': author,
      'comments': comments,
      'hc-emotion-rating': EmotionRating
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
      ...mapGetters({
        user: 'auth/user',
        isVerified: 'auth/isVerified'
      }),
      content () {
        const txt = this.contribution.content || this.contribution.contentExcerpt
        return txt.replace(/(\r\n|\n\r|\r|\n)/g, '<br>$1').replace(/<p><br><\/p>/g, '')
      },
      commentCount () {
        const count = this.contribution.comments ? this.contribution.comments.length : 0
        return (count === undefined) ? 0 : count
      },
      canEdit () {
        const userId = this.user ? this.user._id : null
        return this.isVerified && this.contribution.user._id === userId
      }
    },
    head () {
      return {
        title: this.title
      }
    }
  }
</script>


<style scoped lang="scss">
  .hc__imagecontainer {
    height: 300px;
    overflow: hidden;
    margin: -3rem -1.5rem 1.5rem;
  }

  .b-tabs.footer {
    padding-top: 10px;
    padding-bottom: 40px;
    margin: 1rem -1.5rem -3rem;
  }
</style>
