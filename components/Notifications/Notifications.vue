<template>
    <span class="hc__notifications">
        <a href="">
            <i class="fa fa-bell" aria-hidden="true"></i>
        </a>
        <span class="count" v-if="notifications.length > 0">
            {{ notifications.length }}
        </span>
        <div class="dropdown">
            <transition-group name="notification">
                <div class="hc__notification" v-for="notification in notifications" :key="notification._id">
                    <author :post="notification.contribution"></author>
                    <p v-html="notification.message"></p>
                </div>
            </transition-group>
        </div>
    </span>
</template>


<script>
  import {mapGetters} from 'vuex'
  import feathers from '~plugins/feathers'
  import author from '~components/Author.vue'

  export default {
    components: {
      'author': author
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
            app.notifications.push(notification)
          })
      }
    },
    mounted () {
      this.getNotifications()
      this.subscribeToNotifications()
    }
  }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/utilities";

    .hc__notifications {
        .dropdown {
            display:none;
        }
    }

    .notification-enter-active, .notification-leave-active {
        transition: all .5s ease-out;
    }
    .notification-enter, .notification-leave-to {
        opacity: 0;
        transform: translateX(-10px);
    }
</style>
