<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section">
          <div class="content autowrap">
            <contribution-image :refresh="refrashOrNot" :src="contribution.teaserImg"></contribution-image>
            <div class="columns is-mobile">
              <div class="column">
                <author :post="contribution"></author>
              </div>
              <div class="column">
                <nuxt-link v-if="canEdit" class="button pull-right" :to="{ path: `/contributions/edit/${contribution.slug}` }">
                  <i class="fa fa-pencil" style="font-size: 1rem;"></i>&nbsp; Edit
                </nuxt-link>
              </div>
            </div>
            <div class="notification is-danger is-hidden-tablet">
              <strong>The sidebar is currently hidden on mobile!</strong>
            </div>
            <h1>{{ contribution.title }}</h1>
            <div class="tags" v-if= "categories.length">
              <span class="tag is-primary" v-for="category in categories">
                <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon> {{ category.title }}
              </span>
            </div>
            <p class="content" v-html="content"></p>
            <br/>
            <div class="columns">
              <div class="column is-9 is-mobile">
                <hc-emotion-rating :contribution="contribution" :user="user"></hc-emotion-rating>
              </div>
              <div class="column is-3 is-mobile">
                <nav class="level is-mobile" style="margin-top: 0.5rem;">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="smiley heading">
                        <hc-button circle size="large" color="success"
                                   style="font-size: 2em; margin-bottom: 0.8rem;">
                          <hc-icon set="fa" icon="bullhorn" />
                        </hc-button><br/>
                        Recommend
                      </p>
                      <p class="title" style="font-size: 1.5rem; margin-top: -0.5rem;">
                        1000k
                      </p>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            <no-ssr v-if="!user" >
              <div class="notification is-warning columns is-mobile is-vcentered" style="margin-top: 20px">
                <div class="column is-9 is-paddingless">
                  You need to be logged-in to be able to vote or comment on Human Connection.
                </div>
                <div class="column is-3 is-paddingless">
                  <hc-button size="small" class="is-pulled-right" type="nuxt"
                             :to="{ name: 'auth-login', params: { path: this.$route.path }}">Login / Sign-Up &nbsp; <hc-icon icon="sign-in"/></hc-button>
                </div>
              </div>
            </no-ssr>
          </div>
          <no-ssr>
            <b-tabs class="footer">
              <b-tab-item :label="'Comments (' + commentCount + ')'">
                <comments :post="contribution"/>
              </b-tab-item>
              <b-tab-item label="Let's Talk">
                <div class="notification is-warning">
                  <strong>Lets Talk</strong>, comming soon...
                </div>
              </b-tab-item>
              <b-tab-item label="Versus">
                <div class="notification is-warning">
                  <strong>Versus</strong>, comming soon...
                </div>
              </b-tab-item>
            </b-tabs>
          </no-ssr>
        </section>
      </div>
    </div>
    <div class="column is-3 is-2-widescreen is-hidden-mobile" style="position: relative;">
      <aside class="menu" style="position: fixed; width: 100%;">
        <ul class="menu-list">
          <li>
            <nuxt-link :to="{ path: '/contributions/' + this.contribution.slug }" class="is-capitalized is-active">
              1. <strong>{{ contribution.type }}</strong>
            </nuxt-link>
            <ul>
              <li>
                <a>Kommentare ({{commentCount}})</a>
              </li>
              <li>
                <a>Let's Talk</a>
              </li>
              <li>
                <a>Versus</a>
              </li>
            </ul>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }">
              2. <strong>Mehr Info</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }">
              3. <strong>Aktiv werden</strong>
            </nuxt-link>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>


<script>
  import author from '~/components/Author/Author.vue'
  import feathers from '~/plugins/feathers'
  import comments from '~/components/Comments/Comments.vue'
  import {mapGetters} from 'vuex'
  import EmotionRating from '~/components/Contributions/EmotionRating.vue'
  import ContributionImage from '~/components/Contributions/ContributionImage.vue'
  import _ from 'lodash'

  export default {
    scrollToTop: false,
    components: {
      'author': author,
      'comments': comments,
      'hc-emotion-rating': EmotionRating,
      ContributionImage
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
        // we need to cast the comments array as it might be an object when only one is present
        return _.isEmpty(this.contribution.comments) ? 0 : _.castArray(this.contribution.comments).length
      },
      categories () {
        return _.isEmpty(this.contribution.categories) ? [] : _.castArray(this.contribution.categories)
      },
      canEdit () {
        const userId = this.user ? this.user._id : null
        return this.isVerified && this.contribution.user._id === userId
      },
      refrashOrNot () {
        let newVar = !!this.$route.query.refresh === true ? 800 : null
        return newVar
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
  @import 'assets/styles/utilities';

  .card {
    border: none;
    box-shadow: $card-shadow;
  }
  .b-tabs.footer {
    padding-top: 10px;
    padding-bottom: 40px;
    margin: 1rem -1.5rem -3rem;
  }
</style>
