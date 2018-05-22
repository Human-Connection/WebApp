<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section take-action">
          <div class="content">
            <h1 class="title is-1">{{ $t('component.contribution.takeAction') }}</h1>
            <hc-contribution-bread-crumb :contribution="contribution" />

            <h3 class="title is-4" id="organizations">{{ $t('component.contribution.organizations') }}</h3>
            <!--<div class="tabs is-small">
              <ul>
                <li class="is-active"><a>Wohltätig</a></li>
                <li><a>Non-Profit</a></li>
                <li><a>Andere</a></li>
              </ul>
            </div>-->
            <table class="table is-striped" :class="{ 'is-empty': !organizations.length }">
              <tbody v-if="organizations.length">
                <tr style="cursor: pointer" v-for="organization in organizations" :key="organization._id" @click="$router.push('/organizations/' + organization.slug)">
                  <td>
                    <img v-if="organization.logo" style="max-width: 100px;" :src="organization.logo" alt=""/>
                  </td>
                  <td>
                    <strong>{{ organization.name }}</strong><br/>
                    <small>{{ organization.descriptionExcerpt }}</small>
                  </td>
                  <td class="has-text-right"><strong>{{ organization.followersCounts ? organization.followersCounts.users : 0 }}</strong>&nbsp;Follower</td>
                </tr>
                <tr>
                  <td colspan="3" class="is-white">
                    <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td class="has-text-centered">
                    <h6 class="is-size-6 has-text-grey" v-html="$t('page.takeAction.noOrganizations')"></h6>
                    <hc-button @click.prevent="$router.push('/organizations/create')">
                      <i class="fa fa-plus"></i>
                      &nbsp;<span>{{ $t('component.contribution.organizationsCreate') }}</span>
                    </hc-button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="canDos">
              <h3 class="title is-4" id="can-dos">{{ $t('component.contribution.canDos') }}</h3>
              <can-do-list :can-dos="canDos" @update="updateContribution" />
            </div>

            <div class="under-construction">
              <h3 class="title is-4" id="projects"> {{ $t('component.contribution.projects') }}</h3>
              <table class="table is-striped" :class="{ 'is-empty': !projects.length }">
                <tbody v-if="projects.length">
                  <tr v-for="project in projects" :key="project._id">
                    <td>
                      <strong>{{ project.name }}</strong><br/>
                      <small>{{ project.description }}</small>
                    </td>
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
                      <h6 class="is-size-6 has-text-grey" v-html="$t('page.takeAction.noProjects')"></h6>
                      <button class="button is-primary">
                        <hc-icon icon="plus" set="fa"></hc-icon>&nbsp; {{ $t('button.addProject', 'Add Project') }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="under-construction">
              <h3 class="title is-4" id="jobs">{{ $t('component.contribution.jobs') }}</h3>
              <table class="table is-striped">
                <tbody>
                <tr>
                  <td>Bienenstöcke bauen</td>
                  <td>Anleitung erstellen</td>
                  <td class="has-text-right">Unbegrenzt</td>
                </tr>
                <tr>
                  <td>Bienenstockbauer</td>
                  <td>Handwerker</td>
                  <td class="has-text-right"><strong>10</strong> benötigt</td>
                </tr>
                <tr>
                  <td colspan="3" class="is-white">
                    <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="under-construction">
              <h3 class="title is-4" id="events">{{ $t('component.contribution.events') }}</h3>
              <table class="table is-striped">
                <tbody>
                <tr>
                  <td style="width: 110px;">
                    <div class="has-text-centered is-pulled-left">
                      <div class="is-inline-block has-text-centered">
                        <span class="title is-5">10</span><br/>
                        <span class="heading is-inline">Aug</span>
                      </div>
                      <div class="is-inline-block has-text-centered">
                        <span class="title is-5">&nbsp;-&nbsp;</span><br/>
                        <span class="heading is-inline">&nbsp;</span>
                      </div>
                      <div class="is-inline-block has-text-centered">
                        <span class="title is-5">12</span><br/>
                        <span class="heading is-inline">Aug</span>
                      </div>
                    </div>
                  </td>
                  <td>Online-Workshop Bienen züchten</td>
                  <td>Überall</td>
                  <td class="has-text-right"><strong>158</strong> nehmen teil</td>
                </tr>
                <tr>
                  <td style="width: 110px;">
                    <div class="has-text-centered is-pulled-left">
                      <span class="title is-5">03</span><br/>
                      <span class="heading is-inline">Sep</span>
                    </div>
                  </td>
                  <td>Weltweiter Honigbienentag</td>
                  <td>Berlin</td>
                  <td class="has-text-right"><strong>171.526</strong> nehmen teil</td>
                </tr>
                <tr>
                  <td colspan="4" class="is-white">
                    <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 id="maps">{{ $t('component.contribution.map') }}</h3>
              <hc-map :lang="$i18n.locale()" :places="places" :zoom="zoom" :center="center" height="350px" :token="$env.MAPBOX_TOKEN" />
            </div>

          </div>
        </section>
      </div>
    </div>
    <div class="column is-3 is-2-widescreen is-hidden-mobile">
      <no-ssr>
        <affix relative-element-selector=".section" :offset="{ top: 79, bottom: 40 }" style="width: 100%">
          <aside class="menu" style="width: 700px" ref="menu">
            <ul class="menu-list">
              <li>
                <hc-button type="link" :to="{ path: '/contributions/' + this.contribution.slug }" class="is-capitalized">
                  1. <strong>{{ $t('component.contribution.post') }}</strong>
                </hc-button>
              </li>
              <li>
                <hc-button type="link" :to="{ path: '/contributions/more-info/' + this.contribution.slug }">
                  2. <strong>{{ $t('component.contribution.moreInfoBriefOrLong', null, 1) }}</strong>
                </hc-button>
              </li>
              <li>
                <hc-button type="link" :to="{ path: '/contributions/take-action/' + this.contribution.slug }" class="is-active">
                  3. <strong>{{ $t('component.contribution.takeAction') }}</strong>
                </hc-button>
                <ul>
                  <li><a v-scroll-to="{el: '#organizations'}">{{ $t('component.contribution.organizations') }}</a></li>
                  <li><a v-scroll-to="{el: '#can-dos'}">{{ $t('component.contribution.canDos') }}</a></li>
                  <li><a v-scroll-to="{el: '#projects'}">{{ $t('component.contribution.projects') }}</a></li>
                  <li><a v-scroll-to="{el: '#jobs'}">{{ $t('component.contribution.jobs') }}</a></li>
                  <li><a v-scroll-to="{el: '#events'}">{{ $t('component.contribution.events') }}</a></li>
                  <li><a v-scroll-to="{el: '#maps'}">{{ $t('component.contribution.map') }}</a></li>
                </ul>
              </li>
            </ul>
          </aside>
        </affix>
      </no-ssr>
    </div>
  </div>
</template>


<script>
  import comments from '~/components/Comments/Comments.vue'
  import {mapGetters} from 'vuex'
  import EmotionRating from '~/components/Contributions/EmotionRating.vue'
  import ContributionImage from '~/components/Contributions/ContributionImage.vue'
  import CanDoList from '~/components/CanDos/List.vue'
  import { isEmpty } from 'lodash'

  // lazy loaded components
  const ContributionBreadcrumb = () => import('~/components/Contributions/ContributionBreadcrumb.vue')
  const Map = () => import('~/components/Map/Map.vue')

  const generatePlaces = (models) => {
    let places = []
    if (isEmpty(models)) {
      return places
    }

    models.forEach(entity => {
      if (isEmpty(entity.addresses)) {
        return
      }
      entity.addresses.forEach(address => {
        places.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [address.lng, address.lat]
          },
          properties: {
            title: entity.name,
            description: entity.description
          }
        })
      })
    })
    return places
  }

  export default {
    scrollToTop: false,
    components: {
      'comments': comments,
      'hc-emotion-rating': EmotionRating,
      'hc-contribution-bread-crumb': ContributionBreadcrumb,
      ContributionImage,
      'hc-map': Map,
      CanDoList
    },
    data () {
      return {
        contribution: null,
        title: null,
        places: [],
        zoom: 3,
        center: {
          lat: 49.890860,
          lng: 10.327148
        }
      }
    },
    async asyncData ({app, params, error}) {
      try {
        const contributions = await app.$api.service('contributions').find({
          query: {
            slug: params.slug,
            $limit: 1
          }
        })
        const organizations = await app.$api.service('organizations').find({
          query: {
            categoryIds: {
              $in: contributions.data[0].categoryIds
            },
            isEnabled: 1,
            reviewedBy: {
              $ne: null
            },
            $limit: 5,
            $sort: {
              followersCounts: -1
            }
          }
        })
        const projects = await app.$api.service('projects').find({
          query: {
            categoryIds: {
              $in: contributions.data[0].categoryIds
            },
            $limit: 3
          }
        })
        let data = {
          organizations: organizations.data || [],
          projects: projects.data || [],
          contribution: contributions.data[0],
          title: contributions.data[0].title
        }
        data.places = generatePlaces([...data.organizations, ...data.projects])
        return data
      } catch (err) {
        error({statusCode: err.code || 500, message: err.message})
        return {}
      }
    },
    methods: {
      async updateContribution () {
        this.contribution = await this.$api.service('contributions')
          .get(this.contribution._id)
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
        return isEmpty(this.contribution.comments) ? 0 : this.contribution.comments.length
      },
      categories () {
        return isEmpty(this.contribution.categories) ? [] : this.contribution.categories
      },
      canEdit () {
        const userId = this.user ? this.user._id : null
        return this.isVerified && this.contribution.user._id === userId
      },
      refreshOrNot () {
        let newVar = !!this.$route.query.refresh === true ? 800 : null
        return newVar
      },
      canDos () {
        if (!this.contribution.associatedCanDos || !this.contribution.associatedCanDos.length) {
          return false
        }
        return this.contribution.associatedCanDos
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
  .create-organization-wrapper {
    margin: 10px 0px;
  }
</style>
