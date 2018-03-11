<template>
  <hc-dropdown ref="dropdown"
    :mobileFull="true"
    :hideFooterTablet="true">
    <hc-navbar-button slot="toggle">
      <span class="notification-icon">
        <hc-icon icon="bell"
          class="notification-icon-bell"
          :class="{ animate: notify }"></hc-icon>
        <hc-count-label :count="notifications.length" v-if="notifications"></hc-count-label>
      </span>
    </hc-navbar-button>
    <div class="hc-notifications">
      <hc-dropdown-title>
        {{ $t('component.notification.label') }}
      </hc-dropdown-title>
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
            :notification="notification" :key="notification._id"
            @click.native="followNotification(notification)" />
        </transition-group>
      </div>
    </div>
    <div slot="footer">
      <hc-button @click="$refs.dropdown.close()"
        size="medium"
        :fullWidth="true">
        {{ $t('button.close', 'Close') }}
      </hc-button>
    </div>
  </hc-dropdown>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import NotificationItem from '~/components/Notifications/Item.vue'

  export default {
    name: 'hc-notifications',
    components: {
      NotificationItem
    },
    data () {
      return {
        ready: false,
        active: false,
        notify: false,
        timeout: null,
        lastCount: 0
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        notifications: 'notifications/all'
      })
    },
    watch: {
      notifications (notifications) {
        // only add animation to notification icon then we got some new notifications
        if (notifications.length <= this.lastCount) {
          this.lastCount = notifications.length
          return
        }
        // remember the notification count
        this.lastCount = notifications.length

        // add the notify flag wich is used to animate the notification icon
        this.notify = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          clearTimeout(this.timeout)

          // remove the notify flag to clean the class from the animation as preperation froe the next time
          this.notify = false
        }, 500)
      }
    },
    methods: {
      ...mapMutations({
        addNotification: 'notifications/add'
      }),
      followNotification (notification) {
        if (notification.relatedCommentId) {
          this.$router.push(`/contributions/${notification.contribution.slug}?showComment=${notification.relatedCommentId}`)
        } else {
          this.$router.push(`/contributions/${notification.contribution.slug}`)
        }

        // mark all notifications with the same contribution id as read
        this.$store.dispatch('notifications/markAsRead', {
          id: notification._id
        })
        this.active = false
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
    0%   { transform: rotate(0deg); }
    10%   { transform: rotate(10deg); }
    30%  { transform: rotate(-15deg); }
    60%  { transform: rotate(20deg); }
    90%  { transform: rotate(-15deg); }
    100% { transform: rotate(0deg); }
  }

  .hc-notifications {
    min-width: 340px;
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
</style>