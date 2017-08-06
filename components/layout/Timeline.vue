<template>
  <div class="column is-6 timeline content">
    <hc-box top="true" bottom="true">
      <hc-title>Timeline</hc-title>
    </hc-box>
    <div class="timeline-intro">
      <p>Hallo Dennis, was sind deine Pläne für heute?</p>
      <p v-if="contributions.length == 0">
        Keine Beträge, schreibe doch etwas.
      </p>
      <hc-button color="primary" size="large" type="nuxt" to="/contributions/write" circle>
        <hc-icon icon="plus"/>
      </hc-button>
    </div>
    <div>
      <a class="button is-loading" v-if="loading">Loading ...</a>
      <div v-if="contributions.length > 0" class="timeline-missing-line"></div>
      <div class="timeline-post-wrapper is-clearfix" v-if="contributions.length > 0"
        v-for="(contribution, index) in contributions">
        <div class="timeline-post-direction" :class="oddOrEven(index)"
         @mouseenter="mouseenter" @mouseleave="mouseleave">
          <contribution-card class="card timeline" :class="getarrow()"
            :post="contribution" :key="contribution.slug">
            <small slot="category">{{ contribution.type }}</small>
          </contribution-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import feathers from '~plugins/feathers'
  import ContributionCard from '~components/Contributions/ContributionCard'

  export default {
    data () {
      return {
        hasArrow: true,
        loading: false,
        contributions: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    components: {
      ContributionCard
    },
    methods: {
      oddOrEven (index) {
        return parseInt(index) % 2 === 0 ? 'even' : 'odd'
      },
      mouseenter () {
        console.log('enter')
        this.hasArrow = false
      },
      mouseleave () {
        console.log('leave')
        this.hasArrow = true
      },
      getarrow () {
        console.log('arrow')
        return this.hasArrow ? 'arrow' : ''
      }
    },
    mounted () {
      console.log('mounted')
      this.loading = true;
      (async () => {
        let user = this.user

        console.log({user})

        try {
          let res = await feathers.service('contributions').find({
            query: {
              userId: user._id,
              $sort: {
                createdAt: -1
              }
            }
          })
          this.loading = false
          console.log({res})
          this.contributions = Array.isArray(res.data) ? res.data : []
        } catch (err) {
          console.log(err)
          this.loading = false
        }
      })()
    }
  }
</script>
<style scoped lang="scss">
$green: hsl(78, 71%, 41%);
.timeline {
  .timeline-missing-line {
    width: 50%;
    height: 20px;
    border-right: 2px solid $green;
    margin-top: -10px;
  }
  .timeline-post-wrapper {
    width: 100%;
  }
  .timeline-post-direction {
    .arrow {
      position: relative;
    }
    .arrow:after, .arrow:before {
      top: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    .arrow:after {
      border-color: rgba(255, 255, 255, 0);
      border-width: 10px;
      margin-top: -10px;
    }
    .arrow:before {
      border-color: rgba(255, 255, 255, 0);
      border-width: 10px;
      margin-top: -10px;
    }

    width: 50%;
    &.odd {
      float: right;
      border-left: 2px solid $green;
      margin-right: 2px;
      .card {
        &.timeline {
          float: right;
        }
      }
      .arrow:after, .arrow:before {
        right: 100%;
      }
      .arrow:after {
        border-right-color: #ffffff;
      }
      .arrow:before {
        border-right-color: #ffffff;
      }
    }
    &.even {
      border-right: 2px solid $green;
      .arrow:after, .arrow:before {
        left: 100%
      }
      .arrow:after {
        border-left-color: #ffffff;
      }
      .arrow:before {
        border-left-color: #ffffff;
      }
    }
  }
  .timeline-intro {
    text-transform: uppercase;
    text-align: center;
    color: grey;
    padding: 10px 0;
    font-size: 14px;
    letter-spacing: 1px;

    .add-post {
      display: block;
      margin: 10px auto;
      border: 0;
      border-radius: 50px;
      width: 50px;
      height: 50px;
      background-color: #9c3;
      hc-box-shadow: 1px 1px 3px grey;
      font-size: 30px;
      color: white;
      font-weight: lighter;
    }
  }
}
</style>
