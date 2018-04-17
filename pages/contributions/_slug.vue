<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card autowrap">
        <section class="section">
          <div class="">
            <contribution-image v-if="!hasEmbeddedVideo" :refresh="refreshOrNot" :src="contribution.thumbnails.teaserImg"></contribution-image>
            <div class="columns is-mobile">
              <div class="column">
                <author
                  class="author"
                  :user="contribution.user"
                  :created-at="contribution.createdAt" />
              </div>
              <div class="column is-one-third">
                <hc-button v-if="canEdit"
                           class="action-btn"
                           color="light"
                           :isLoading="isLoading"
                           @click="isLoading = true"
                           :to="{ path: `/contributions/edit/${contribution.slug}` }">
                  <i class="fa fa-pencil" style="font-size: 1rem;"></i>&nbsp; {{ $t('button.edit') }}
                </hc-button>
                <contribution-menu class="button is-light action-btn"
                                  :post="contribution"
                                  @update="onContribSettingsUpdate" />
              </div>
            </div>
            <div class="message is-danger is-small" v-if="!contribution.isEnabled">
              <div class="message-body">
                <i class="fa fa-eye-slash"></i> &nbsp;<span>{{ $t('component.contribution.postDisabled') }}</span>
              </div>
            </div>
            <div class="message is-warning is-small" v-if="contribution.visibility === 'private' || !contribution.categoryIds.length">
              <div class="message-body">
                <i class="fa fa-eye-slash"></i> &nbsp;<span>{{ $t('component.contribution.postPrivate') }}</span>
              </div>
            </div>
            <div class="cando-header" v-if="isCanDo">
              <div class="cando-header-action">
                <can-do-action :post="contribution"
                  @update="onContribSettingsUpdate" />
              </div>
              <div class="cando-header-count">
                <can-do-count :post="contribution" />
              </div>
            </div>
            <h2 class="title is-4">{{ contribution.title }}</h2>
            <div class="cando-details-difficulty" v-if="isCanDo">
              <can-do-difficulty :post="contribution" />
            </div>
            <div class="content hc-editor-content" v-html="content" ref="content"></div>
            <div class="cando-details-reason" v-if="isCanDo">
              <can-do-reason :post="contribution" />
            </div>
            <div class="is-hidden-tablet">
              <br />
              <hc-contribution-bread-crumb :contribution="contribution" />
              <br />
            </div>
            <br/>
            <div class="tags" v-if= "categories.length">
              <span class="tag" v-for="category in categories" :key="category._id">
                <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon> {{ $t(`component.category.slug2label-${category.slug}`) }}
              </span>
            </div>
            <div class="tags" v-if= "tags.length">
              <span class="tag" v-for="tag in tags" :key="tag._id">
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
                    <shout-button :contribution="contribution" :user="user" />
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
            <div ref="tabs">
              <b-tabs class="footer">
                <b-tab-item v-bind:label="$t('component.contribution.commentsCounted', {count: commentCount}, commentCount)" id="comments">
                  <comments :post="contribution"/>
                </b-tab-item>
                <b-tab-item v-bind:label="$t('component.contribution.letsTalk')" id="lets-talk">
                  <div class="notification is-warning">
                    {{ $t('component.contribution.letsTalkDescription', {user: contribution.user.name }) }}
                    <br/><br/>
                    <img src="/under-construction.svg" width="20" style="margin-bottom: -3px; display: inline-block;" /> (<strong>Lets Talk</strong>, coming soon...)
                  </div>
                </b-tab-item>
                <b-tab-item v-bind:label="$t('component.contribution.versus')" id="versus">
                  <div class="notification is-warning">
                    {{ $t('component.contribution.versusDescription') }}
                    <br/><br/>
                    <img src="/under-construction.svg" width="20" style="margin-bottom: -3px; display: inline-block;" /> (<strong>Versus</strong>, coming soon...)
                  </div>
                </b-tab-item>
              </b-tabs>
            </div>
          </no-ssr>
        </section>
      </div>
    </div>
    <div class="column is-3 is-2-widescreen is-hidden-mobile" style="position: relative;">
      <aside class="menu" style="position: fixed; width: 100%;">
        <ul class="menu-list">
          <li>
            <nuxt-link :to="{ path: '/contributions/' + this.contribution.slug }" class="is-capitalized is-active">
              1. <strong>{{ $t('component.contribution.type-' + contribution.type) }}</strong>
            </nuxt-link>
            <ul>
              <li>
                <a v-scroll-to="{el: $refs.tabs}">{{ $t('component.contribution.commentsCounted', {count: commentCount}, commentCount) }}</a>
              </li>
              <li>
                <a v-scroll-to="{el: $refs.tabs}">{{ $t('component.contribution.letsTalk') }}</a>
              </li>
              <li>
                <a v-scroll-to="{el: $refs.tabs}">{{ $t('component.contribution.versus') }}</a>
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
  import comments from '~/components/Comments/Comments.vue'
  import {mapGetters} from 'vuex'
  import EmotionRating from '~/components/Contributions/EmotionRating.vue'
  import ShoutButton from '~/components/Contributions/ShoutButton.vue'
  import ContributionMenu from '~/components/Contributions/ContributionMenu'
  import CanDoAction from '~/components/CanDos/Action'
  import CanDoCount from '~/components/CanDos/Count'
  import CanDoDifficulty from '~/components/CanDos/Difficulty'
  import CanDoReason from '~/components/CanDos/Reason'
  import { isEmpty, truncate } from 'lodash'
  import linkifyHtml from 'linkifyjs/html'

  const ContributionImage = () => import('~/components/Contributions/ContributionImage.vue')
  const ContributionBreadcrumb = () => import('~/components/Contributions/ContributionBreadcrumb.vue')

  export default {
    scrollToTop: false,
    components: {
      'author': author,
      'comments': comments,
      'hc-emotion-rating': EmotionRating,
      'hc-contribution-bread-crumb': ContributionBreadcrumb,
      ShoutButton,
      ContributionImage,
      ContributionMenu,
      CanDoAction,
      CanDoCount,
      CanDoDifficulty,
      CanDoReason
    },
    data () {
      return {
        contribution: null,
        title: null,
        isLoading: false
      }
    },
    async asyncData ({app, params, error}) {
      try {
        let res = await app.$api.service('contributions').find({
          query: {
            slug: params.slug,
            $limit: 1
          }
        })
        if (isEmpty(res.data)) {
          error({ statusCode: 404 })
          return {}
        }
        return {
          contribution: res.data[0],
          title: res.data[0].title
        }
      } catch (err) {
        error({statusCode: err.code || 500, message: err.message})
        return {}
      }
    },
    mounted () {
      this.$api.service('contributions')
        .on('patched', this.onContribSettingsUpdate)
    },
    methods: {
      onContribSettingsUpdate (data) {
        if (data._id === this.contribution._id) {
          this.contribution = data
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        commentCount: 'comments/count',
        isVerified: 'auth/isVerified'
      }),
      hasEmbeddedVideo () {
        if (!this.contribution || !this.contribution.meta || !this.contribution.meta.hasVideo) {
          return false
        }
        return this.contribution.content.indexOf('<iframe') >= 0
      },
      content () {
        if (!this.contribution) {
          return ''
        }

        let content = this.contribution.content || this.contribution.contentExcerpt
        content = content.replace(/(\r\n|\n\r|\r|\n)/g, '<br>$1').replace(/<p><br><\/p>/g, '')

        if (process.server) {
          return content
        }

        const utils = require('~/modules/quill-url-embeds/index').utils
        const populator = new utils.populator('/embeds')
        this.$nextTick(() => {
          populator.populate(this.$refs.content)
        })
        return content
      },
      categories () {
        return isEmpty(this.contribution.categories) ? [] : this.contribution.categories
      },
      tags () {
        return isEmpty(this.contribution.tags) ? [] : this.contribution.tags
      },
      canEdit () {
        const userId = this.user ? this.user._id : null
        return this.isVerified && this.contribution.user._id === userId
      },
      refreshOrNot () {
        return !!this.$route.query.refresh === true ? 800 : null
      },
      isCanDo () {
        if (this.contribution.type !== 'cando') {
          return null
        }
        return !!this.contribution.cando
      }
    },
    head () {
      return {
        title: this.title
      }
    }
  }
</script>


<style lang="scss">
  @import 'assets/styles/utilities';
  @import '~bulma/sass/base/helpers';

  .card {
    border: none;
    box-shadow: $card-shadow;
  }

  .b-tabs.footer {
    padding-top: 10px;
    padding-bottom: 40px;
    margin: 1rem -1.5rem -3rem;
  }

  .action-btn {
    @extend .is-pulled-right;
    margin-left: 0.5rem;
  }

  .cando-header {
    margin: 1.6rem 0 2rem;
    & > div {
      margin-bottom: 0.5rem;
    }

    @media (min-width: $desktop) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .cando-details-reason {
    margin-top: 2.5rem;
  }
</style>
