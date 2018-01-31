<template>
  <section class="content">
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.users', 'Users') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="userCount" :duration="countDuration" :autoplay="true"></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.contributions', 'Contributions') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="contributionCount" :duration="countDuration" :autoplay="true"></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.comments', 'Comments') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="commentsCount" :duration="countDuration" :autoplay="true"></count-to>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.notifications', 'Notifications') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="notificationCount" :duration="countDuration" :autoplay="true"></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.organisations', 'Organizations') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="organizationCount" :duration="countDuration" :autoplay="true"></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.projects', 'Projects') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="projectCount" :duration="countDuration" :autoplay="true"></count-to>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import countTo from 'vue-count-to'

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
        contributionCount: 0,
        commentsCount: 0,
        organizationCount: 0,
        projectCount: 0,
        notificationCount: 0,
        emotionCount: 0
      }
    },
    mounted () {
      feathers.service('users').find({query: { $limit: 0 }})
        .then(res => {
          console.log(res)
          this.userCount = res.total || 0
        })
      feathers.service('contributions').find({query: { $limit: 0 }})
        .then(res => {
          this.contributionCount = res.total || 0
        })
      feathers.service('comments').find({query: { $limit: 0 }})
        .then(res => {
          this.commentsCount = res.total || 0
        })
      feathers.service('organizations').find({query: { $limit: 0 }})
        .then(res => {
          this.organizationCount = res.total || 0
        })
      feathers.service('projects').find({query: { $limit: 0 }})
        .then(res => {
          this.projectCount = res.total || 0
        })
      feathers.service('notifications').find({query: { $limit: 0 }})
        .then(res => {
          this.notificationCount = res.total || 0
        })
      feathers.service('emotions').find({query: { $limit: 0 }})
        .then(res => {
          this.emotionCount = res.total || 0
        })
    }
  }
</script>

<style scoped lang="scss">

</style>
