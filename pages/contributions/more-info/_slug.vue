<template>
  <div class="columns">
    <div class="column is-8 is-offset-1-widescreen">
      <div class="card">
        <section class="section content">
          <div class="notification is-danger is-hidden-tablet">
            <strong>The sidebar is currently hidden on mobile!</strong>
          </div>
          <h1>More Info</h1>
          <div class="notification">
            <strong>This is currenty dummy content</strong>
          </div>

          <h3 v-if= "categories.length">Themen</h3>
          <div class="tags" v-if= "categories.length">
            <span class="tag is-primary" v-for="category in categories">
              {{ category.title }}
            </span>
          </div>

          <h3>Tags</h3>
          <div class="tags">
            <span class="tag">Tag 1</span>
            <span class="tag">Tag 2</span>
            <span class="tag">Tag 3</span>
          </div>

          <h3>Verwandte Posts</h3>
          <table>
            <tbody>
              <tr>
                <td>Strategienn für Honigbienen</td>
                <td class="has-text-right"><strong>1024</strong> Aktivitäten</td>
              </tr>
              <tr>
                <td>Warum brauchen Bienen unsere hilfe?</td>
                <td class="has-text-right"><strong>502</strong> Aktivitäten</td>
              </tr>
              <tr>
                <td>Stadtbienen</td>
                <td class="has-text-right"><strong>123</strong> Aktivitäten</td>
              </tr>
            </tbody>
          </table>

          <h3>Pro & Kontras</h3>
          <table>
            <tbody>
              <tr>
                <td>Kann die globale Erwärmung positive Effekte...</td>
                <td class="has-text-right"><strong>3</strong> Pro | <strong>7</strong> Con</td>
              </tr>
              <tr>
                <td>Gryphosat - eine Bedrohung für Bienen?</td>
                <td class="has-text-right"><strong>11</strong> Pro | <strong>3</strong> Con</td>
              </tr>
            </tbody>
          </table>

          <h3>Bestlisten</h3>
          <table>
            <tbody>
              <tr>
                <td>Die größsten Bedrohungen für Bienen</td>
                <td class="has-text-right"><strong>4</strong> Optionen</td>
              </tr>
              <tr>
                <td>Bienenpollen und Gesundheit</td>
                <td class="has-text-right"><strong>7</strong> Optionen</td>
              </tr>
            </tbody>
          </table>

          <h3>Votes</h3>
          <table>
            <tbody>
            <tr>
              <td>Soll die EU Neonicotinoide Verbieten?</td>
              <td class="has-text-right"><strong>204</strong> Votes</td>
            </tr>
            </tbody>
          </table>

          <h3>Chatrooms</h3>
          <table>
            <tbody>
            <tr>
              <td>Eventchat mit immer Gene Brandi</td>
              <td>Heute: 16 Uhr - 20 Uhr</td>
              <td class="has-text-right"><strong>20</strong> Personen</td>
            </tr>
            <tr>
              <td>Biodiversität</td>
              <td>Permanenter Chat</td>
              <td class="has-text-right"><strong>124</strong> Personen</td>
            </tr>
            </tbody>
          </table>
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
            <nuxt-link :to="{ path: '/contributions/more-info/' + this.contribution.slug }" class="is-active">
              2. <strong>More Info</strong>
            </nuxt-link>
            <ul>
              <li><a>Verwandte Posts</a></li>
              <li><a>Pro & Kontras</a></li>
              <li><a>Bestlisten</a></li>
              <li><a>Votes</a></li>
              <li><a>Chatrooms</a></li>
            </ul>
          </li>
          <li>
            <nuxt-link :to="{ path: '/contributions/take-action/' + this.contribution.slug }">
              3. <strong>Take Action</strong>
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
