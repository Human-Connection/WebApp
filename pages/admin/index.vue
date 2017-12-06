<template>
  <section class="content">
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Users</p>
            <p class="title">{{ userCount }}</p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Contributions</p>
            <p class="title">{{ contributionCount }}</p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Comments</p>
            <p class="title">{{ commentsCount }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Notifications</p>
            <p class="title">{{ notificationCount }}</p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Organizations</p>
            <p class="title">{{ organizationCount }}</p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Projects</p>
            <p class="title">{{ projectCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import feathers from '~/plugins/feathers'

  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: 'Kategorien verwalten'
      }
    },
    data () {
      return {
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
