<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section">
          <div class="content autowrap">
            <contribution-image :refresh="refreshOrNot" :src="contribution.thumbnails.teaserImg"></contribution-image>
            <div class="columns is-mobile">
              <div class="column">
                <author :post="contribution"></author>
              </div>
              <div class="column is-one-third">
                <hc-button v-if="canEdit"
                           class="pull-right"
                           color="light"
                           :loading="loading"
                           @click="loading = true"
                           :to="{ path: `/contributions/edit/${contribution.slug}` }">
                  <i class="fa fa-pencil" style="font-size: 1rem;"></i>&nbsp; {{ $t('button.edit') }}
                </hc-button>
              </div>
            </div>
            <div class="notification is-danger is-hidden-tablet">
              <strong>The sidebar is currently hidden on mobile!</strong>
            </div>
            <h1>{{ contribution.title }}</h1>
            <div class="content" v-html="content"></div>
            <br/>
            <div class="tags" v-if= "categories.length">
              <span class="tag" v-for="category in categories">
                <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon> {{ $t(`component.category.slug2label-${category.slug}`) }}
              </span>
            </div>
            <div class="tags" v-if= "tags.length">
              <span class="tag" v-for="tag in tags">
                <hc-icon set="fa" icon="tag"></hc-icon>&nbsp;{{ tag }}
              </span>
            </div>
            <div class="columns">
              <div class="column is-9 is-mobile">
                <hc-emotion-rating :contribution="contribution" :user="user"></hc-emotion-rating>
              </div>
              <div class="column is-3 is-mobile">
                <nav class="level is-mobile" style="margin-top: 0.5rem;">
                  <div class="level-item has-text-centered">
                    <div>
                      <div class="smiley heading">
                        <hc-tooltip :label="$t('component.contribution.shoutAddShout')">
                          <hc-button circle size="large" color="success"
                                     style="font-size: 2em; margin-bottom: 0.8rem;">
                            <hc-icon set="fa" icon="bullhorn" />
                          </hc-button>
                        </hc-tooltip>
                        <br/>
                        {{ $t('component.contribution.shoutOf') }}
                      </div>
                      <div class="title" style="font-size: 1.5rem; margin-top: -0.5rem;">
                        {{ shoutCount }}
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            <no-ssr v-if="!user" >
              <div class="notification is-warning columns is-mobile is-vcentered" style="margin-top: 20px">
                <div class="column is-9 is-paddingless">
                  {{ $t('auth.account.loginRequired4CommentOrVote') }}
                </div>
                <div class="column is-3 is-paddingless">
                  <hc-button size="small" class="is-pulled-right" type="nuxt"
                    :to="{ name: 'auth-login', params: { path: this.$route.path }}">{{ $t('auth.account.loginOrRegister') }} &nbsp;
                    <hc-icon icon="sign-in"/>
                  </hc-button>
                </div>
              </div>
            </no-ssr>
          </div>
          <no-ssr>
            <b-tabs class="footer">
              <b-tab-item v-bind:label="$t('component.contribution.commentsCounted', {count: commentCount}, commentCount)" id="comments">
                <comments :post="contribution"/>
              </b-tab-item>
              <b-tab-item v-bind:label="$t('component.contribution.letsTalk')" id="lets-talk">
                <div class="notification is-warning">
                  {{ $t('component.contribution.letsTalkDescription', {user: contribution.user.name }) }}
                  <br/><br/>(<strong>Lets Talk</strong>, coming soon...)
                </div>
              </b-tab-item>
              <b-tab-item v-bind:label="$t('component.contribution.versus')" id="versus">
                <div class="notification is-warning">
                  {{ $t('component.contribution.versusDescription') }}
                  <br/><br/>(<strong>Versus</strong>, coming soon...)
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
              1. <strong>{{ $t('component.contribution.post') }}</strong>
            </nuxt-link>
            <ul>
              <li>
                <nuxt-link to="#comments">{{ $t('component.contribution.commentsCounted', {count: commentCount}, commentCount) }}</nuxt-link>
              </li>
              <li>
                <nuxt-link to="#lets-talk">{{ $t('component.contribution.letsTalk') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link to="#versus">{{ $t('component.contribution.versus') }}</nuxt-link>
              </li>
            </ul>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }">
              2. <strong>{{ $t('component.contribution.moreInfoBriefOrLong', null, 1) }}</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }">
              3. <strong>{{ $t('component.contribution.takeAction') }}</strong>
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
  import _ from 'lodash'

  const ContributionImage = () => import('~/components/Contributions/ContributionImage.vue')

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
        title: null,
        loading: false
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
      shoutCount () {
        // we need to cast the comments array as it might be an object when only one is present
        return _.isEmpty(this.contribution.shouts) ? 0 : _.castArray(this.contribution.shouts).length
      },
      categories () {
        return _.isEmpty(this.contribution.categories) ? [] : _.castArray(this.contribution.categories)
      },
      tags () {
        return _.isEmpty(this.contribution.tags) ? [] : _.castArray(this.contribution.tags)
      },
      canEdit () {
        const userId = this.user ? this.user._id : null
        return this.isVerified && this.contribution.user._id === userId
      },
      refreshOrNot () {
        return !!this.$route.query.refresh === true ? 800 : null
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
