<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section">
          <div class="content">
            <div class="notification is-danger is-hidden-tablet">
              <strong>The sidebar is currently hidden on mobile!</strong>
            </div>
            <h1>Take Action</h1>
            <div class="notification">
              <strong>This is currenty dummy content</strong>
            </div>

            <h3>Organisationen</h3>
            <div class="tabs is-small">
              <ul>
                <li class="is-active"><a>Wohltätig</a></li>
                <li><a>Non-Profit</a></li>
                <li><a>Andere</a></li>
              </ul>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Natural Wildlife Fundation</td>
                  <td class="has-text-right"><strong>1234</strong> Follower</td>
                </tr>
                <tr>
                  <td>Safe the Honeybee Fundation</td>
                  <td class="has-text-right"><strong>321</strong> Follower</td>
                </tr>
              </tbody>
            </table>

            <h3>Can Do's</h3>
            <table>
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
              </tbody>
            </table>

            <h3>Projekte</h3>
            <table>
              <tbody>
              <tr>
                <td>
                  <strong>We build Bee City</strong><br/>
                  <small>Wir haben bereits 20 Bienenstöcke gebaut!</small>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Semabelha Semelimento - Bee or not to be</strong><br/>
                  <small>Die Bee Alert App</small>
                </td>
              </tr>
              </tbody>
            </table>

            <h3>Jobs</h3>
            <table>
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
              </tbody>
            </table>

            <h3>Bevorstehende Events</h3>
            <div class="notification">Keine Events</div>

            <h3>Karte</h3>
            <hc-map :places="places" :zoom="zoom" :center="center" style="height: 300px;" />
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
              2. <strong>More Info</strong>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }" class="is-active">
              3. <strong>Take Action</strong>
            </nuxt-link>
            <ul>
              <li><a>Organisationen</a></li>
              <li><a>Can Do's</a></li>
              <li><a>Projekte</a></li>
              <li><a>Jobs</a></li>
              <li><a>Karte</a></li>
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
