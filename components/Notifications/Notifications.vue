<template>
  <hc-dropdown ref="dropdown"
               :mobileFull="true"
               :hideFooterTablet="true">
    <hc-navbar-button slot="toggle">
      <span class="notification-icon">
        <span class="is-hidden">{{ $t('component.notification.label') }}</span>
        <hc-icon icon="bell"
                 class="notification-icon-bell"
                 :class="{ animate: notify }"></hc-icon>
        <hc-count-label :count="unseenTotal" v-if="notifications"></hc-count-label>
      </span>
    </hc-navbar-button>
    <div class="hc-notifications">
      <hc-dropdown-title>
        {{ $t('component.notification.label') }}
      </hc-dropdown-title>
      <div class="hc-notifications-content">
        <p v-if="!isAuthenticated" class="dropdown-content empty">
          Please
          <nuxt-link :to="{ name: 'auth-login' }">login</nuxt-link>
          to see your notifications.
        </p>
        <p v-else-if="notifications.length === 0" class="dropdown-content empty">
          {{ $t('component.notification.messageEmpty') }}
        </p>
        <div v-else>
          <transition-group name="notification" tag="div">
            <notification-item v-for="notification in notifications"
                               :notification="notification"
                               :key="notification._id"
                               @click.native="followNotification(notification)"/>
          </transition-group>
          <infinite-loading @infinite="onInfinite" v-if="hasMore">
            <div slot="spinner" class="loader-spinner">
              <div class="is-loading"></div>
            </div>
          </infinite-loading>
        </div>
      </div>
    </div>
    <div slot="footer">
      <hc-button @click="$refs.dropdown.close()"
                 size="medium"
                 :fullWidth="true">
        <hc-icon class="icon-left" icon="times"/>
        {{ $t('button.close', 'Close') }}
      </hc-button>
    </div>
  </hc-dropdown>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import NotificationItem from '~/components/Notifications/Item.vue'
  import {isEmpty} from 'lodash'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  import {throttle} from 'lodash'

  export default {
    name: 'hc-notifications',
    components: {
      NotificationItem,
      InfiniteLoading
    },
    data () {
      return {
        ready: false,
        active: false,
        notify: false,
        timeout: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        notifications: 'notifications/all',
        notificationsTotal: 'notifications/total',
        unseenTotal: 'notifications/unseenTotal',
        hasMore: 'notifications/hasMore'
      })
    },
    watch: {
      unseenTotal (unseenTotal) {
        // only add animation to notification icon then we got some new notifications
        if (!unseenTotal) {
          return
        }

        this.notify = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.notify = false
        }, 500)
      }
    },
    methods: {
      ...mapActions({
        markAsRead: 'notifications/markAsRead',
        fetchMore: 'notifications/fetchMore'
      }),
      followNotification (notification) {
        if (isEmpty(notification.contribution)) {
          // DO NOTHING!
        } else if (notification.relatedCommentId) {
          this.$router.push(`/contributions/${notification.contribution.slug}?showComment=${notification.relatedCommentId}`)
        } else {
          this.$router.push(`/contributions/${notification.contribution.slug}`)
        }

        // mark all notifications with the same contribution id as read
        this.markAsRead({notification})
        this.active = false
      },
      async onInfinite ($state) {
        await this.fetchMore()
        $state.loaded()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .notification-icon {
    position: relative;
    vertical-align: middle;
    display: inline-block;
  }

  .notification-icon-bell.animate {
    transform: rotate(0deg);
    transform-origin: 50% 0;
    animation-name: notify;
    animation-duration: 300ms;
  }

  @keyframes notify {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(10deg);
    }
    30% {
      transform: rotate(-15deg);
    }
    60% {
      transform: rotate(20deg);
    }
    90% {
      transform: rotate(-15deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .hc-notifications {
    width: 340px;

    @include tablet() {
      width: 360px;
    }
  }

  .hc-notifications-content {
    @include tablet() {
      overflow-y: auto;
      min-height: 100px;
      max-height: 400px;
    }
  }

  .dropdown-content {
    padding: 0.5rem 1rem 0.8rem;
    border: none;
    box-shadow: none;
  }

  .dropdown-content.empty {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
    text-align: center;
    color: $grey-light;
  }

  .loader-spinner {
    width: 100%;
    position: relative;
    height: 80px;
    display: flex;
  }
</style>
