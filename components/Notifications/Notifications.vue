<template>
    <span class="hc__notifications">
        <b-dropdown v-model="notifications" v-show="ready">
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
            <div class="dropdown-scroll">
                <transition-group name="notification">
                    <div class="hc__notification option" v-for="notification in notifications" :key="notification._id" @click="$router.push(`/contributions/${notification.contribution.slug}`)">
                        <author :post="notification.comment"></author>
                        <p v-html="notification.message"></p>
                    </div>
                </transition-group>
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
        skip: 0,
        ready: false
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
        feathers.service('notifications').find({
          query: {
            $limit: 30,
            $sort: {
              createdAt: -1
            }
          }
        })
          .then(res => {
            this.notifications = res.data
            this.limit = res.limit
            this.skip = res.skip
            this.ready = true
          })
          .catch((err) => {
            console.error(err)
            this.ready = true
          })
      },
      subscribeToNotifications () {
        feathers.service('notifications')
          .on('created', notification => {
            console.log(notification)
            console.log(this.notifications)
            this.notifications.unshift(notification)
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
        background-color: $grey-dark;
        color: $white;
        font-weight: $weight-bold;
        margin-bottom: 0.2em;
    }

    .dropdown .box {
      padding: 0.2em;

      @include desktop() {
        left: 100% !important;
        transform: translateX(-50%);
      }
    }

    .dropdown-scroll {
      overflow: auto;
      max-height: 400px;
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