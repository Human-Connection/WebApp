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
            <h1 class="title is-1"> Aktiv werden</h1>
            <div class="notification is-hidden">
              <strong>This is currenty dummy content</strong>
            </div>

            <h3 class="title is-4" id="organizations">Organisationen</h3>
            <div class="is-hidden tabs is-small">
              <ul>
                <li class="is-active"><a>Wohltätig</a></li>
                <li><a>Non-Profit</a></li>
                <li><a>Andere</a></li>
              </ul>
            </div>
            <table class="table is-striped">
              <tbody>
                <tr v-for="organization in organizations" :key="organization._id">
                  <td>
                    <img style="max-width: 100px;" src="" alt=""/>
                  </td>
                  <td>
                    <strong>{{ organization.name }}</strong><br/>
                    <small>{{ organization.description }}</small>
                  </td>
                  <td class="has-text-right"><strong>{{ organization.followerIds.length }}</strong>&nbsp;Follower</td>
                </tr>
                <tr>
                  <td colspan="3" class="is-white">
                    <a href="" class="is-block is-fullwidth has-text-right">Mehr <hc-icon icon="angle-down"></hc-icon></a>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 class="title is-4" id="can-dos">Can Do's</h3>
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
                  <a href="" class="is-block is-fullwidth has-text-right">Mehr <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>

            <h3 class="title is-4" id="projects">Projekte</h3>
            <table class="table is-striped">
              <tbody>
              <tr v-for="project in projects" :key="project._id">
                <td>
                  <strong>{{ project.name }}</strong><br/>
                  <small>{{ project.description }}</small>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="is-white">
                  <a href="" class="is-block is-fullwidth has-text-right">Mehr <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>

            <h3 class="title is-4" id="jobs">Jobs</h3>
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
                  <a href="" class="is-block is-fullwidth has-text-right">Mehr <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>

            <h3 class="title is-4" id="events">Events</h3>
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
                  <a href="" class="is-block is-fullwidth has-text-right">Mehr <hc-icon icon="angle-down"></hc-icon></a>
                </td>
              </tr>
              </tbody>
            </table>

            <h3 id="maps">Karte</h3>
            <no-ssr>
              <hc-map :places="places" :zoom="zoom" :center="center" style="height: 300px;" />
            </no-ssr>
          </div>
        </section>
      </div>
    </div>
    <div class="column is-3 is-2-widescreen is-hidden-mobile" style="position: relative;">
      <aside class="menu" style="position: fixed; width: 100%;">
        <ul class="menu-list">
          <li>
            <nuxt-link :to="{ path: '/contributions/' + this.contribution.slug }" class="is-capitalized">
              1. <strong>{{ contribution.type }}</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }">
              2. <strong>Mehr Info</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }" class="is-active">
              3. <strong>Aktiv werden</strong>
            </nuxt-link>
            <ul>
              <li><a href="#organizations">Organisationen</a></li>
              <li><a href="#can-dos">Can Do's</a></li>
              <li><a href="#projects">Projekte</a></li>
              <li><a href="#jobs">Jobs</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#maps">Karte</a></li>
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
  import Map from '~/components/Map/Map.vue'
  import _ from 'lodash'

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
        places: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
          },
          properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.414, 37.776]
          },
          properties: {
            title: 'Mapbox',
            description: 'San Francisco, California'
          }
        }],
        zoom: 3,
        center: {
          lng: -99.0073,
          lat: 40.7124
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
            }
          }
        })
        const projects = await feathers.service('projects').find({
          query: {
            categoryIds: {
              $in: contributions.data[0].categoryIds
            }
          }
        })
        return {
          organizations: organizations.data || [],
          projects: projects.data || [],
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
  .table {
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
