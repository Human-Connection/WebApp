<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section">
          <div class="content">
            <div class="notification is-danger is-hidden-tablet">
              <strong>The sidebar is currently hidden on mobile!</strong>
            </div>
            <div class="is-inline-flex is-hidden">
              <div class="has-text-centered" style="padding-right: 1rem;">
                <p class="heading">
                  <hc-button color="primary" size="medium" circle>
                    <hc-icon set="hc" icon="categories-justforfun"></hc-icon>
                  </hc-button>
                </p>
                <p class="heading">Just for Fun</p>
              </div>
              <div class="has-text-centered" style="padding-right: 1rem;">
                <p class="heading">
                  <hc-button color="" size="medium" circle>
                    <hc-icon set="hc" icon="categories-luck"></hc-icon>
                  </hc-button>
                </p>
                <p class="heading">Glück & Werte</p>
              </div>
              <div class="has-text-centered" style="padding-right: 1rem;">
                <p class="heading">
                  <hc-button color="primary" size="medium" circle>
                    <hc-icon set="hc" icon="categories-health"></hc-icon>
                  </hc-button>
                </p>
                <p class="heading">Gesundheit & Wohlbefinden</p>
              </div>
            </div>
            <h1 class="title is-1">{{ $t('component.contribution.takeAction') }}</h1>
            <div class="notification is-hidden">
              <strong>This is currenty dummy content</strong>
            </div>

            <h3 class="title is-4" id="organizations">{{ $t('component.contribution.organizations') }}</h3>
            <div class="is-hidden tabs is-small">
              <ul>
                <li class="is-active"><a>Wohltätig</a></li>
                <li><a>Non-Profit</a></li>
                <li><a>Andere</a></li>
              </ul>
            </div>
            <table class="table is-striped" :class="{ 'is-empty': !organizations.length }">
              <tbody v-if="organizations.length">
                <tr v-for="organization in organizations" :key="organization._id">
                  <td>
                    <img v-if="organization.logo" style="max-width: 100px;" :src="organization.logo" alt=""/>
                  </td>
                  <td>
                    <strong>{{ organization.name }}</strong><br/>
                    <small>{{ organization.description }}</small>
                  </td>
                  <td class="has-text-right"><strong>{{ organization.followerIds.length }}</strong>&nbsp;Follower</td>
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
                    <button class="button is-primary">
                      <hc-icon icon="plus" set="fa"></hc-icon>&nbsp; {{ $t('button.addOrganization', 'Add Organization') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 class="title is-4" id="can-dos">{{ $t('component.contribution.canDos') }}</h3>
            <table class="table is-striped">
              <tbody>
              <tr>
                <td>Einen bienenfreundlichen Garten anlegen</td>
                <td>Schwer</td>
                <td class="has-text-right"><strong>58</strong> haben das geschafft</td>
              </tr>
              <tr>
                <td>Einen Bienenstock Bauen</td>
                <td>Einfach</td>
                <td class="has-text-right"><strong>1023</strong> haben das geschafft</td>
              </tr>
              <tr>
                <td>Lokales Biogemüse kaufen</td>
                <td>Einfach</td>
                <td class="has-text-right"><strong>12.038</strong> haben das geschafft</td>
              </tr>
              <tr>
                <td colspan="3" class="is-white">
                  <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>

            <h3 class="title is-4" id="projects"> {{ $t('component.contribution.projects') }}</h3>
            <table class="table is-striped" :class="{ 'is-empty': !organizations.length }">
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

            <h3 id="maps">{{ $t('component.contribution.map') }}</h3>
            <hc-map :places="places" :zoom="zoom" :center="center" height="400px" />
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
            <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }">
              2. <strong>{{ $t('component.contribution.moreInfoBriefOrLong', null, 1) }}</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }" class="is-active">
              3. <strong>{{ $t('component.contribution.takeAction') }}</strong>
            </nuxt-link>
            <ul>
              <li><a href="#organizations">{{ $t('component.contribution.organizations') }}</a></li>
              <li><a href="#can-dos">{{ $t('component.contribution.canDos') }}</a></li>
              <li><a href="#projects">{{ $t('component.contribution.projects') }}</a></li>
              <li><a href="#jobs">{{ $t('component.contribution.jobs') }}</a></li>
              <li><a href="#events">{{ $t('component.contribution.events') }}</a></li>
              <li><a href="#maps">{{ $t('component.contribution.map') }}</a></li>
            </ul>
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

  // lazy loaded components
  const Map = () => import('~/components/Map/Map.vue')

  const generatePlaces = (models) => {
    let places = []
    if (_.isEmpty(models)) {
      return places
    }

    models.forEach(entity => {
      if (_.isEmpty(entity.addresses)) {
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
      'author': author,
      'comments': comments,
      'hc-emotion-rating': EmotionRating,
      ContributionImage,
      'hc-map': Map
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
    async asyncData ({params, error}) {
      try {
        const contributions = await feathers.service('contributions').find({
          query: {
            slug: params.slug
          }
        })
        const organizations = await feathers.service('organizations').find({
          query: {
            categoryIds: {
              $in: contributions.data[0].categoryIds
            },
            $limit: 3
          }
        })
        const projects = await feathers.service('projects').find({
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
  .table {
    &.is-empty {
      tr:hover {
        background-color: transparent;
      }
    }

    td {
      border-color: $grey-lighter;
    }
  }

  .b-tabs.footer {
    padding-top: 10px;
    padding-bottom: 40px;
    margin: 1rem -1.5rem -3rem;
  }
</style>
