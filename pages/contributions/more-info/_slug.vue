<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section more-info content">
          <h1 class="title is-1">{{ $t('component.contribution.moreInfoBriefOrLong', null, 2) }}</h1>
          <hc-contribution-bread-crumb :contribution="contribution" />

          <h3 v-if= "categories.length">{{ $t('component.category.labelLongOnePluralNone', null, categories.length) }}</h3>
          <div class="tags" v-if= "categories.length">
            <span class="tag" v-for="category in categories">
              <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon> {{ $t(`component.category.slug2label-${category.slug}`) }}
            </span>
          </div>

          <template v-if="tags.length">
            <h3>{{ $t('component.contribution.tagOnePluralNone', null, 2) }}</h3>
            <div class="tags">
              <span class="tag" v-for="tag in tags">
                <hc-icon set="fa" icon="tag"></hc-icon>&nbsp;{{ tag }}
              </span>
            </div>
          </template>

          <h3 id="relatedPosts">{{ $t('component.contribution.postRelatedLabelPluralised', null, 2) }}</h3>
          <table class="table is-striped" :class="{ 'is-empty': !relatedPosts.length }">
            <tbody v-if="relatedPosts.length">
              <tr style="cursor: pointer" v-for="contribution in relatedPosts" @click="$router.push('/contributions/' + contribution.slug)">
                <td>{{ contribution.title }}</td>
                <td class="has-text-right"><strong>1024</strong> Aktivitäten</td>
              </tr>
              <tr>
                <td colspan="2" class="is-white">
                  <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td class="has-text-centered">
                  <h6 class="is-size-6 has-text-grey" v-html="$t('page.moreInfo.noContributions')"></h6>
                  <hc-button color="primary" type="nuxt" to="/contributions/write">
                    <hc-icon icon="plus" set="fa"></hc-icon>&nbsp; {{ $t('button.addContribution', 'Add Contribution') }}
                  </hc-button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="under-construction">
            <h3 id="proAndContras">{{ $t('component.contribution.proAndContraPluralised', null, 2) }}</h3>
            <table class="table is-striped">
              <tbody>
                <tr>
                  <td>Kann die globale Erwärmung positive Effekte...</td>
                  <td class="has-text-right"><strong>3</strong> Pro | <strong>7</strong> Con</td>
                </tr>
                <tr>
                  <td>Gryphosat - eine Bedrohung für Bienen?</td>
                  <td class="has-text-right"><strong>11</strong> Pro | <strong>3</strong> Con</td>
                </tr>
                <tr>
                  <td colspan="2" class="is-white">
                    <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="under-construction">
            <h3 id="bestlists">{{ $t('component.contribution.bestList') }}</h3>
            <table class="table is-striped">
              <tbody>
                <tr>
                  <td>Die größsten Bedrohungen für Bienen</td>
                  <td class="has-text-right"><strong>4</strong> Optionen</td>
                </tr>
                <tr>
                  <td>Bienenpollen und Gesundheit</td>
                  <td class="has-text-right"><strong>7</strong> Optionen</td>
                </tr>
                <tr>
                  <td colspan="2" class="is-white">
                    <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="under-construction">
            <h3 id="votes">{{ $t('component.contribution.voteOnePluralNone', null, 0) }}</h3>
            <table class="table is-striped">
              <tbody>
              <tr>
                <td>Soll die EU Neonicotinoide Verbieten?</td>
                <td class="has-text-right"><strong>204</strong> Votes</td>
              </tr>
              <tr>
                <td colspan="2" class="is-white">
                  <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="under-construction">
            <h3 id="chatrooms">{{ $t('component.contribution.chatroomBriefOrLong', null, 2) }}</h3>
            <table class="table is-striped">
              <tbody>
              <tr>
                <td style="width: 130px;">
                  <div class="has-text-centered">
                    <span class="title is-5">Heute</span><br/>
                    <span class="heading is-inline">16 – 20 Uhr</span>
                  </div>
                </td>
                <td>Eventchat mit immer Gene Brandi</td>
                <td class="has-text-right"><strong>20</strong> Personen</td>
              </tr>
              <tr>
                <td style="width: 130px;">
                  <div class="has-text-centered">
                    <span class="title is-5">∞</span><br/>
                    <span class="heading is-inline">Permanent</span>
                  </div>
                <td>Biodiversität</td>
                <td class="has-text-right"><strong>124</strong> Personen</td>
              </tr>
              <tr>
                <td colspan="3" class="is-white">
                  <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
    <div class="column is-3 is-2-widescreen is-hidden-mobile" style="position: relative;">
      <aside class="menu" style="position: fixed; width: 100%;">
        <ul class="menu-list">
          <li>
            <nuxt-link :to="{ path: '/contributions/' + this.contribution.slug }" class="is-capitalized">
              1. <strong>{{ $t('component.contribution.post') }}</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }" class="is-active">
              2. <strong>{{ $t('component.contribution.moreInfoBriefOrLong', null, 1) }}</strong>
            </nuxt-link>
            <ul>
              <li><a href="#relatedPosts">{{ $t('component.contribution.postRelatedLabelPluralised', null, 2) }}</a></li>
              <li><a href="#proAndContras">{{ $t('component.contribution.proAndContraPluralised', null, 2) }}</a></li>
              <li><a href="#bestlists">{{ $t('component.contribution.bestList') }}</a></li>
              <li><a href="#votes">{{ $t('component.contribution.voteOnePluralNone', null, 2) }}</a></li>
              <li><a href="#chatrooms">{{ $t('component.contribution.chatroomBriefOrLong', null, 1) }}</a></li>
            </ul>
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
  import comments from '~/components/Comments/Comments.vue'
  import {mapGetters} from 'vuex'
  import EmotionRating from '~/components/Contributions/EmotionRating.vue'
  import ContributionImage from '~/components/Contributions/ContributionImage.vue'
  import HcRelativeDateTime from '~/components/Global/Utilities/RelativeDateTime/RelativeDateTime'
  import { isEmpty, castArray } from 'lodash'

  const ContributionBreadcrumb = () => import('~/components/Contributions/ContributionBreadcrumb.vue')

  export default {
    scrollToTop: false,
    components: {
      HcRelativeDateTime,
      'comments': comments,
      'hc-emotion-rating': EmotionRating,
      'hc-contribution-bread-crumb': ContributionBreadcrumb,
      ContributionImage
    },
    data () {
      return {
        contribution: null,
        title: null
      }
    },
    async asyncData ({app, params, error}) {
      try {
        let contributions = await app.$api.service('contributions').find({
          query: {
            slug: params.slug
          }
        })
        const relatedPosts = await app.$api.service('contributions').find({
          query: {
            categoryIds: {
              $in: contributions.data[0].categoryIds
            },
            type: 'post',
            $limit: 3
          }
        })
        return {
          relatedPosts: relatedPosts.data || [],
          contribution: contributions.data[0],
          title: contributions.data[0].title
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
        return isEmpty(this.contribution.comments) ? 0 : castArray(this.contribution.comments).length
      },
      categories () {
        return isEmpty(this.contribution.categories) ? [] : castArray(this.contribution.categories)
      },
      tags () {
        return isEmpty(this.contribution.tags) ? [] : castArray(this.contribution.tags)
      },
      canEdit () {
        const userId = this.user ? this.user._id : null
        return this.isVerified && this.contribution.user._id === userId
      },
      refreshOrNot () {
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
