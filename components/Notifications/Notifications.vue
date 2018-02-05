<template>
  <div class="navbar-item has-dropdown notifications" @blur="active = false" tabindex="0">
    <a class="navbar-link dropdown-toggle" @click="active = !active" :class="{ active: active, animate: notify }">
      <span class="notification-icon">
        <i class="fa fa-bell" aria-hidden="true"></i>
        <hc-count-label :count="notifications.length" v-if="notifications"></hc-count-label>
      </span>
    </a>
    <transition name="box">
      <div class="box notification-box" v-if="active">
        <p class="dropdown-title">{{ $t('component.notification.label') }}</p>
        <p v-if="!isAuthenticated" class="dropdown-content empty">
          Please
          <nuxt-link :to="{ name: 'auth-login' }">login</nuxt-link>
          to see your notifications.
        </p>
        <div v-if="notifications">
          <p v-if="notifications.length === 0" class="dropdown-content empty">
            {{ $t('component.notification.messageEmpty') }}
          </p>
          <div class="dropdown-scroll" v-if="notifications.length">
            <transition-group name="notification" tag="div">
              <notification-item v-for="notification in notifications"
                :notification="notification" :key="notification._id"
                @click.native="followNotification(notification)" />
            </transition-group>
          </div>
        </div>
      </div>
    </transition>
    <transition name="overlay">
      <div class="dropdown-overlay" v-if="active" @click="active = false"></div>
    </transition>
  </div>
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
        this.$router.push(`/contributions/${notification.contribution.slug}`)

        // mark all notifications with the same contribution id as read
        this.$store.dispatch('notifications/markAsRead', {
          id: notification.contribution._id
        })
        this.active = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .navbar-item {
    position: relative;

    &, &:hover, &:hover > .navbar-link {
      background-color: transparent !important;
    }
  }

  .notifications.has-dropdown {
    outline: none !important;
    box-shadow: none !important;
    background-color: #fff;

    position: relative;
    user-select: none;
    text-align: left;

    .dropdown-toggle {
      outline: none !important;
      display: flex;
      height: 100%;

      &.active {
        color: $grey-darker;
      }
    }

    .notification-icon {
      position: relative;
      vertical-align: middle;
      display: inline-block;
    }

    .notification-box {
      padding: 0;
      width: 300px;
      position: fixed;
      // transform: translateY(-50%) translateX(-50%);
      z-index: 1001;
      box-shadow: $card-shadow-hover;
      // background-color: #fff;

      transform: translateY(-50%) translateX(-50%);
      left: 50vw;
      top: 50vh;

      @include desktop() {
        position: absolute;
        overflow: hidden;
        top: 100%;
        margin-top: 1px;
        left: 50% !important;
        transform: translateX(-50%);
        margin-left: auto;
      }
    }

    .dropdown-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: $backdrop-color;
      z-index: 1000;
      @include desktop() {
        display: none;
      }
    }

    .dropdown-title {
      font-weight: $weight-bold;
      // margin-bottom: 0.2em;
      padding: 0.8rem 1rem 0.8rem;
      border-bottom: 1px solid $grey-lighter;
      background-color: #fff;
    }

    .dropdown-scroll {
      overflow: auto;

      max-height: 70vh;
      @include desktop() {
        max-height: 400px;
      }
    }

    .dropdown-content {
      padding: 0.5rem 1rem 0.8rem;
      border: none;
      box-shadow: none;
    }

    .box-enter-active, .box-leave-active {
      transition: all 100ms ease-out;
    }

    .box-enter, .box-leave-to {
      opacity: 0;
      transform: translateX(-50%) translateY(-50%) scale(0.7);

      @include desktop() {
        transform: translateX(-50%) translateY(-5px) scaleX(0.95);
      }
    }

    .overlay-enter-active, .overlay-leave-active {
      transition: all .2s ease-out;
    }

    .overlay-enter, .overlay-leave-to {
      opacity: 0;
    }

    .notification-enter-active, .notification-leave-active {
      transition: all .5s ease-out;
    }

    .notification-enter, .notification-leave-to {
      opacity: 0;
      transform: translateX(-10px);
    }
  }

  .dropdown-content.empty {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
    text-align: center;
    color: $grey-light;
  }

  @keyframes notify {
    0%   { transform: rotate(0deg); }
    10%   { transform: rotate(10deg); }
    30%  { transform: rotate(-15deg); }
    60%  { transform: rotate(20deg); }
    90%  { transform: rotate(-15deg); }
    100% { transform: rotate(0deg); }
  }

  .dropdown-toggle {
    &.animate {
      i {
        transform: rotate(0deg);
        transform-origin: 50% 0;
        animation-name: notify;
        animation-duration: 300ms;
      }
    }
  }
</style>