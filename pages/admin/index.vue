<template>
  <section>
    <!--<h3 class="title is-3">{{ $t('component.dashbord.label', 'Dashboard') }}</h3>-->
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <hc-tooltip type="is-dark" :label="`${userCountUnverified} Unverified | ${userCountActive} Monthly Active | ${userCountOnline} Online`">
            <div>
              <p class="heading">{{ $t('component.admin.users', 'Users') }}</p>
              <p class="title">
                <count-to :startVal="0" :endVal="userCount" :duration="countDuration" :autoplay="true" separator="." />
              </p>
            </div>
          </hc-tooltip>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <hc-tooltip type="is-dark" :label="`${contributionCountPost} Posts | ${contributionCountCanDo} CanDo's`">
            <div>
              <p class="heading">{{ $t('component.admin.contributions', 'Contributions') }}</p>
              <p class="title">
                <count-to :startVal="0" :endVal="contributionCount" :duration="countDuration" :autoplay="true" separator="." />
              </p>
            </div>
          </hc-tooltip>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.comments', 'Comments') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="commentsCount" :duration="countDuration" :autoplay="true" separator="." />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <hc-tooltip type="is-dark" :label="`${notificationCount} Total | ${notificationCountUnread} Unread`">
            <div>
              <p class="heading">{{ $t('component.admin.notifications', 'Notifications') }}</p>
              <p class="title" title="total / unread">
                <count-to :startVal="0" :endVal="notificationCount" :duration="countDuration" :autoplay="true" separator="." />
              </p>
            </div>
          </hc-tooltip>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.organizations', 'Organizations') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="organizationCount" :duration="countDuration" :autoplay="true" separator="." />
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.projects', 'Projects') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="projectCount" :duration="countDuration" :autoplay="true" separator="." />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.openInvites', 'Open Invites') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="inviteCount" :duration="countDuration" :autoplay="true" separator="." />
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.follows', 'Follows') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="followCount" :duration="countDuration" :autoplay="true" separator="." />
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.shouts', 'Shouts') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="shoutCount" :duration="countDuration" :autoplay="true" separator="." />
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import countTo from 'vue-count-to'
  import moment from 'moment'

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  export default {
    middleware: 'admin',
    layout: 'admin',
    components: {
      'count-to': countTo
    },
    head () {
      return {
        title: this.$t('component.admin.index_title')
      }
    },
    data () {
      return {
        countDuration: 2500,
        userCount: 0,
        userCountUnverified: 0,
        userCountActive: 0,
        userCountOnline: 0,
        contributionCount: 0,
        contributionCountPost: 0,
        contributionCountCanDo: 0,
        commentsCount: 0,
        organizationCount: 0,
        projectCount: 0,
        notificationCount: 0,
        notificationCountUnread: 0,
        emotionCount: 0,
        inviteCount: 0,
        followCount: 0,
        shoutCount: 0
      }
    },
    async mounted () {

      await wait(50)
      await this.$api.service('users').find({query: { $limit: 0 }})
        .then(res => {
          this.userCount = res.total || 0
        })

      wait(1000).then(async () => {
        await this.$api.service('users').find({query: { $limit: 0, isVerified: { $ne: true } }})
          .then(res => {
            this.userCountUnverified = res.total || 0
          })
        await this.$api.service('users').find({query: { $limit: 0, isVerified: true, lastActiveAt: { $gt: moment().subtract(30, 'days').toDate() } }})
          .then(res => {
            this.userCountActive= res.total || 0
          })
        await this.$api.service('users').find({query: { $limit: 0, isVerified: true, lastActiveAt: { $gt: moment().subtract(30, 'minutes').toDate() } }})
          .then(res => {
            this.userCountOnline= res.total || 0
          })
      })

      await this.$api.service('contributions').find({query: { $limit: 0 }})
        .then(res => {
          this.contributionCount = res.total || 0
        })

      wait(100).then(async () => {
        await this.$api.service('contributions').find({query: { $limit: 0, type: 'post' }})
          .then(res => {
            this.contributionCountPost = res.total || 0
          })
        await this.$api.service('contributions').find({query: { $limit: 0, type: 'cando' }})
          .then(res => {
            this.contributionCountCanDo = res.total || 0
          })
      })

      await this.$api.service('comments').find({query: { $limit: 0 }})
        .then(res => {
          this.commentsCount = res.total || 0
        })

      await this.$api.service('organizations').find({query: { $limit: 0 }})
        .then(res => {
          this.organizationCount = res.total || 0
        })

      await this.$api.service('projects').find({query: { $limit: 0 }})
        .then(res => {
          this.projectCount = res.total || 0
        })

      await this.$api.service('notifications').find({query: { $limit: 0 }})
        .then(res => {
          this.notificationCount = res.total || 0
        })

      wait(1000).then(async () => {
        await this.$api.service('notifications').find({query: { $limit: 0, unseen: true }})
          .then(res => {
            this.notificationCountUnread = res.total || 0
          })
      })

      await this.$api.service('emotions').find({query: { $limit: 0 }})
        .then(res => {
          this.emotionCount = res.total || 0
        })

      await this.$api.service('invites').find({query: { $limit: 0, wasUsed: { $ne: true } }})
        .then(res => {
          this.inviteCount = res.total || 0
        })

      await this.$api.service('follows').find({query: { $limit: 0 }})
        .then(res => {
          this.followCount = res.total || 0
        })

      await this.$api.service('shouts').find({query: { $limit: 0 }})
        .then(res => {
          this.shoutCount = res.total || 0
        })
    }
  }
</script>

<style scoped lang="scss">

</style>
