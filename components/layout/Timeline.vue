<template>
  <div class="column timeline content">
    <hc-title>{{ $t('component.timeline.title') }}</hc-title>
    <div class="timeline-intro">
      <p v-if="!user.slug">{{ $t('component.timeline.introQuestion', { 'username': user.name ? user.name : 'Anonymus' }) }}</p>
      <p v-if="!contributions.length && loadingFinished && !user.slug">
        {{ $t('component.timeline.noContributionsFound') }}
      </p>
      <hc-tooltip v-if="!user.slug"
                  :label="$t('component.contribution.writePost')"
                  type="is-black"
                  position="is-right">
        <hc-button color="primary" size="large" type="nuxt" to="/contributions/write" circle>
          <hc-icon icon="plus"/>
        </hc-button>
      </hc-tooltip>
    </div>
    <div class="timeline-content">
      <div v-if="isLoading" class="timeline-loader">
        <div class="is-loading"></div>
      </div>
      <div class="timeline-missing-line"></div>
      <div class="timeline-post-wrapper is-clearfix">
        <div class="timeline-post-direction" v-if="!isLoading && contributions"
                                             v-for="contribution in contributions"
                                             :key="contribution._id">
          <contribution-card class="card timeline arrow"
            :post="contribution" :key="contribution._id">
            <small slot="category">{{ $t('component.contribution.type-' + contribution.type) }}</small>
          </contribution-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import { mapGetters } from 'vuex'
  import ContributionCard from '~/components/Contributions/ContributionCard.vue'
  import { castArray } from 'lodash'

  export default {
    data () {
      return {
        isLoading: true,
        loadingFinished: false,
        contributions: []
      }
    },
    name: 'hc-timeline',
    props: {
      user: {
        required: true,
        type: Object
      }
    },
    watch: {
      user (user) {
        this.getContributions(user)
      }
    },
    components: {
      ContributionCard
    },
    mounted () {
      this.isLoading = true
      this.loadingFinished = false

      if (this.user) {
        this.getContributions(this.user)
      }
    },
    computed: {
      ...mapGetters({
        accessToken: 'auth/token'
      })
    },
    methods: {
      getContributions (user) {
        // get the contributions by the userId and sort it
        // by createdAt DESC
        (async () => {
          let user = await this.user
          let userId = user._id !== undefined ? user._id : user.data[0]._id
          try {
            let res = await feathers.service('contributions').find({
              query: {
                userId: userId,
                $sort: {
                  createdAt: -1
                }
              }
            })
            this.contributions = castArray(res.data)
            this.isLoading = false
            this.loadingFinished = true
          } catch (err) {
            // this just displays nothing
            // @todo implement some user feedback
            console.error(err)
            this.isLoading = false
            this.loadingFinished = true
          }
        })()
      }
    }
  }
</script>
<style scoped lang="scss">

// @todo maybe move this to global css
$green: hsl(78, 71%, 41%);
.timeline {
  .timeline-missing-line {
    width: 50%;
    height: 20px;
    border-right: 2px solid $green;
    margin-left: 1px;
    margin-top: -10px;
  }
  .timeline-post-wrapper {
    position: relative;
    width: 100%;
  }
  .timeline-post-direction {

    .arrow {
      position: relative;
    }

    .arrow:after,
    .arrow:before {
      top: 50%;
      z-index: 10;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      border-color: rgba(255, 255, 255, 0);
      border-width: 10px;
      margin-top: -10px;
      pointer-events: none;
    }

    padding-top: 2rem;
    width: 50%;
    &:nth-child(even) {
      float: right;
      border-left: 2px solid $green;
      margin-right: 1px;
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
    &:nth-child(odd) {
      border-right: 2px solid $green;
      margin-left: 1px;
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
    text-align: center;
    color: grey;
    padding: 10px 0;
    font-size: 14px;
    letter-spacing: 1px;

    p {
      text-transform: uppercase;
    }

    .add-post {
      display: block;
      margin: 10px auto;
      border: 0;
      border-radius: 50px;
      width: 50px;
      height: 50px;
      background-color: #9c3;
      box-shadow: 1px 1px 3px grey;
      font-size: 30px;
      color: white;
      font-weight: lighter;
    }
  }

  .timeline-content {
    position: relative;
    min-height: 200px;

    .timeline-loader {
      .is-loading::after {
        left: calc(50% - 1em);
        top: calc(50% - 1em);
      }
    }
  }

}
</style>
