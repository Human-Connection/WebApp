<template>
    <span class="hc__notifications">
        <b-dropdown v-model="notifications">
            <a slot="trigger">
                <i class="fa fa-bell" aria-hidden="true"></i>
                <countlabel :count="notifications.length"></countlabel>
            </a>

            <b-dropdown-option subheader class="dropdown-title">
                Notifications
            </b-dropdown-option>

            <b-dropdown-option subheader v-if="!isAuthenticated" class="dropdown-content">
                Please <nuxt-link :to="{ name: 'login' }">login</nuxt-link> to see your notifications.
            </b-dropdown-option>
            <b-dropdown-option subheader v-else-if="notifications.length === 0" class="dropdown-content">
                You have no unread notifications.
            </b-dropdown-option>
            <div class="hc__notification option" v-for="notification in notifications" :key="notification._id" @click="$router.push(`/contributions/${notification.contribution.slug}`)">
                <author :post="notification.comment"></author>
                <p v-html="notification.message"></p>
            </div>
        </b-dropdown>
    </span>
</template>


<script>
  import {mapGetters} from 'vuex'
  import feathers from '~plugins/feathers'
  import author from '~components/Author.vue'
  import countlabel from '~components/CountLabel.vue'

  export default {
    components: {
      'author': author,
      'countlabel': countlabel
    },
    data () {
      return {
        notifications: [],
        limit: 0,
        skip: 0
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated'
      })
    },
    watch: {
      isAuthenticated (authenticated) {
        if (authenticated) {
          this.getNotifications()
        } else {
          this.notifications = []
        }
      }
    },
    methods: {
      getNotifications () {
        let app = this
        feathers.service('notifications').find({
          query: {
            $limit: 30,
            $sort: {
              createdAt: -1
            }
          }
        })
          .then(res => {
            app.notifications = res.data
            app.limit = res.limit
            app.skip = res.skip
          })
          .catch((err) => {
            console.log(err)
          })
      },
      subscribeToNotifications () {
        let app = this
        feathers.service('notifications')
          .on('created', notification => {
            console.log(notification)
            console.log(app.notifications)
            app.notifications.unshift(notification)
          })
      }
    },
    mounted () {
      this.getNotifications()
      this.subscribeToNotifications()
    }
  }
</script>

<style lang="scss">
  @import "../../assets/styles/utilities";

  .hc__notifications {
    position: relative;

    .dropdown-title {
        background-color: $grey-darker;
        color: $white;
        font-weight: $weight-bold;
        border-bottom: 1px solid $grey;
        margin-bottom: 0.2em;
    }

    .dropdown .box {
      left: 100% !important;
      transform: translateX(-50%);
      overflow: auto;
      max-height: 400px;
      padding: 0.2em;
    }

    .notification-enter-active, .notification-leave-active {
      transition: all .5s ease-out;
    }

    .notification-enter, .notification-leave-to {
      opacity: 0;
      transform: translateX(-10px);
    }
  }

  .hc__notification {
    p {
      font-size: $size-7;
    }
  }
</style>