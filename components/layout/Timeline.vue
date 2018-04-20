<template>
  <div ref="timeline" class="column timeline content" style="position: relative;">
    <no-ssr>
      <affix relative-element-selector=".timeline" :offset="{ top: 30, bottom: 40 }" style="width: 100%">
        <div :style="{ width: timelineWidth }">
          <hc-profile-nav class="timeline-nav" :items="timelineNavItems" @changed="onTabChange" :style="{ width: timelineWidth }"/>
        </div>
      </affix>
    </no-ssr>
    <!--<hc-title>{{ $t('component.timeline.title') }}</hc-title>
    <div class="timeline-intro">
      <p v-if="isOwnProfile">{{ $t('component.timeline.introQuestion', { 'username': user.name ? user.name : 'Anonymus' }) }}</p>
      <p v-if="!contributed.data.length && loadingFinished && isOwnProfile">
        {{ $t('component.timeline.noContributionsFound') }}
      </p>
      <hc-tooltip v-if="isOwnProfile"
                  :label="$t('component.contribution.writePost')"
                  type="is-black"
                  position="is-right">
        <hc-button color="primary" size="large" type="nuxt" to="/contributions/write" circle>
          <hc-icon icon="plus"/>
        </hc-button>
      </hc-tooltip>
    </div>-->
    <transition name="fade-delayed">
      <div key="tab-contributions" v-if="tabIndex === 0">
        <div class="timeline-content">
          <div class="timeline-intro" v-if="!contributed.data.length && loadingFinished">
            <p>
              {{ $t('component.timeline.noContributionsFound') }}
            </p>
          </div>
          <div class="timeline-intro" v-if="isOwnProfile">
            <p>{{ $t('component.timeline.introQuestion', { 'username': user.name ? user.name : 'Anonymus' }) }}</p>
            <hc-tooltip :label="$t('component.contribution.writePost')"
                        type="is-black"
                        position="is-right">
              <hc-button color="primary"
                         size="large"
                         type="nuxt"
                         to="/contributions/write" circle>
                <hc-icon icon="plus"/>
              </hc-button>
            </hc-tooltip>
          </div>
          <div v-if="isLoading" class="timeline-loader">
            <div class="is-loading"></div>
          </div>
          <div class="timeline-missing-line"></div>
          <div class="timeline-post-wrapper is-clearfix">
            <div class="timeline-post-direction" v-if="!isLoading && contributed.data"
                                                v-for="contribution in contributed.data"
                                                :key="contribution._id">
              <contribution-card class="card timeline arrow"
                :post="contribution" :key="contribution._id">
                <small slot="category">{{ $t('component.contribution.type-' + contribution.type) }}</small>
              </contribution-card>
            </div>
          </div>
        </div>
      </div>
      <div key="tab-commented" v-if="tabIndex === 1">
        <div class="timeline-content">
          <div v-if="isLoading" class="timeline-loader">
            <div class="is-loading"></div>
          </div>
          <div class="timeline-missing-line"></div>
          <div class="timeline-post-wrapper is-clearfix">
            <div class="timeline-post-direction" v-if="!isLoading && commented.data"
                                                v-for="contribution in commented.data"
                                                :key="contribution._id">
              <contribution-card class="card timeline arrow"
                :post="contribution" :key="contribution._id">
                <small slot="category">{{ $t('component.contribution.type-' + contribution.type) }}</small>
              </contribution-card>
            </div>
          </div>
        </div>
      </div>
      <div key="tab-shouted" v-if="tabIndex === 2">
        <div class="timeline-content">
          <div v-if="isLoading" class="timeline-loader">
            <div class="is-loading"></div>
          </div>
          <div class="timeline-missing-line"></div>
          <div class="timeline-post-wrapper is-clearfix">
            <div class="timeline-post-direction" v-if="!isLoading && shouted.data"
                                                v-for="contribution in shouted.data"
                                                :key="contribution._id">
              <contribution-card class="card timeline arrow"
                :post="contribution" :key="contribution._id">
                <small slot="category">{{ $t('component.contribution.type-' + contribution.type) }}</small>
              </contribution-card>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ContributionCard from '~/components/Contributions/ContributionCard.vue'
  import { castArray, flatMap } from 'lodash'
import { setTimeout } from 'timers';

  export default {
    components: {
      ContributionCard
    },
    name: 'hc-timeline',
    props: {
      user: {
        required: true,
        type: Object
      }
    },
    data () {
      return {
        isLoading: true,
        loadingFinished: false,
        contributed: { total: 0, data: [] },
        commented: { total: 0, data: [] },
        shouted: { total: 0, data: [] },
        tabIndex: 0,
        timelineWidth: 0
      }
    },
    watch: {
      user (user) {
        this.getContributions(user)
      }
    },
    async mounted () {
      this.isLoading = true
      this.loadingFinished = false

      if (process.client) {
        this.$nextTick(() => {
          this.updateNavSize()
          window.addEventListener('resize', this.updateNavSize)
        })
      }

      if (this.user) {
        this.getContributions(this.user)
        this.getCommented(this.user, 0)
        this.getShouts(this.user, 0)
      }
    },
    destroy () {
      if (process.client) {
        window.removeEventListener('resize', this.updateNavSize)
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        accessToken: 'auth/token'
      }),
      isOwnProfile () {
        return !!(this.user && this.currentUser && this.user._id.toString() === this.currentUser._id.toString())
      },
      timelineNavItems () {
        return [
          {
            key: 'contributed',
            label: this.$t('page.profile.navContributed', 'Contributed'),
            count: this.contributed.total || 0,
            action: () => {
              if (this.contributed.total && !this.contributed.data.length) {
                this.getContributions(this.user)
              }
            }
          },
          {
            key: 'commented',
            label: this.$t('page.profile.navCommented', 'Commented'),
            count: this.commented.total || 0,
            action: () => {
              if (this.commented.total && !this.commented.data.length) {
                this.getCommented(this.user)
              }
            }
          },
          {
            key: 'shouted',
            label: this.$t('page.profile.navShouted', 'Shouted'),
            count: this.shouted.total || 0,
            action: () => {
              if (this.shouted.total && !this.shouted.data.length) {
                this.getShouts(this.user)
              }
            }
          }
        ]
      }
    },
    methods: {
      onTabChange (item, index) {
        try {
          if (this.$refs.timeline.getBoundingClientRect().top < 0) {
            this.$scrollTo(this.$refs.timeline, 250, {
              onDone: () => {
                this.tabIndex = index
                item.action()
              }
            })
          } else {
            this.tabIndex = index
            item.action()
          }
        } catch (err) {}
      },
      async getUserId () {
        let user = await this.user
        let userId = user._id !== undefined ? user._id : user.data[0]._id
        return userId
      },
      async getContributions (user, limit = 10, skip = 0) {
        // console.log('getContributions', limit)
        // get the contributions by the userId and sort it
        // by createdAt DESC
        const userId = await this.getUserId()

        let query = {
          userId: userId,
          $limit: limit,
          $sort: {
            createdAt: -1
          }
        }

        // show only public posts if its not your own profile
        if (!this.isOwnProfile) {
          query.visibility = 'public'
            // query.categoryIds = { $exists: true, $not: {$size: 0} }
        }

        try {
          let res = await this.$api.service('contributions').find({query})
          this.contributed = res
          this.isLoading = false
          this.loadingFinished = true
        } catch (err) {
          // this just displays nothing
          // @todo implement some user feedback
          console.error(err)
          this.isLoading = false
          this.loadingFinished = true
        }
      },
      async getShouts (user, limit = 10, skip = 0) {
        // console.log('getShouts', limit)
        // get the contributions by the userId and sort it
        // by createdAt DESC
        const userId = await this.getUserId()

        if (limit) {
          this.isLoading = true
        }

        const shouts = await this.$api.service('shouts').find({
          query: {
            userId,
            $sort: {
              createdAt: -1
            },
            $limit: limit,
            $select: ['foreignId']
          }
        })

        const contributionIds = flatMap(shouts.data, 'foreignId')

        let query = {
          $limit: limit,
          $sort: {
            createdAt: -1
          },
          visibility: 'public',
          isEnabled: true,
          _id: {
            $in: contributionIds
          }
        }

        try {
          let res = await this.$api.service('contributions').find({query})
          this.shouted = res
          this.shouted.total = shouts.total
          this.isLoading = false
          this.loadingFinished = true
        } catch (err) {
          // this just displays nothing
          // @todo implement some user feedback
          console.error(err)
          this.isLoading = false
          this.loadingFinished = true
        }
      },
      async getCommented (user, limit = 10, skip = 0) {
        // console.log('getCommented', limit)
        // get the contributions by the userId and sort it
        // by createdAt DESC
        if (limit) {
          this.isLoading = true
        }

        const userId = await this.getUserId()

        const comments = await this.$api.service('comments').find({
          query: {
            userId,
            $sort: {
              createdAt: -1
            },
            $limit: limit,
            $select: ['contributionId']
          }
        })

        const commentIds = flatMap(comments.data, 'contributionId')

        let query = {
          $limit: limit,
          $sort: {
            createdAt: -1
          },
          userId: {
            $ne: userId
          },
          visibility: 'public',
          isEnabled: true,
          _id: {
            $in: commentIds
          }
        }

        try {
          let res = await this.$api.service('contributions').find({query})
          this.commented = res
          this.commented.total = comments.total
          this.isLoading = false
          this.loadingFinished = true
        } catch (err) {
          // this just displays nothing
          // @todo implement some user feedback
          console.error(err)
          this.isLoading = false
          this.loadingFinished = true
        }
      },
      updateNavSize () {
        try {
          this.timelineWidth =`${this.$refs.timeline.getBoundingClientRect().width - 22}px`
        } catch (err) {}
      },
    }
  }
</script>
<style scoped lang="scss">
  @import "assets/styles/utilities";

  $topMargin: 7rem;

  .affix {
    z-index: 10;
    margin: 0;
    padding: 0;
    top: 0;

    .timeline-nav {
      box-shadow: $card-shadow-hover;
    }
  }

  .affix-top {
    position: absolute;
    margin: 0;
    padding: 0;
    z-index: 10;
    // top: 0;
  }

  .timeline {
    z-index: 0;

    .timeline-nav {
      margin-top: 1rem;
      margin-bottom: 1rem;
      padding: 0;
      position: absolute;
      transition: box-shadow 200ms ease;
      // width: 100%;
    }

    .timeline-missing-line {
      width: 50%;
      height: 20px;
      border-right: 2px solid $primary;
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
      padding-top: $topMargin;

      .timeline-loader {
        .is-loading::after {
          left: calc(50% - 1em);
          top: calc(50% - 1em);
        }
      }
    }

  }
</style>
