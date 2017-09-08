<template>
  <div class="hc__notifications dropdown" @blur="active = false" tabindex="0">
    <a class="nav-item dropdown-toggle" @click="active = !active" :class="{ active: active }">
      <span class="notification-icon">
        <i class="fa fa-bell" aria-hidden="true"></i>
        <hc-count-label :count="notifications.length" v-if="notifications"></hc-count-label>
      </span>
    </a>
    <transition name="box">
      <div class="box" v-if="active">
        <p class="dropdown-title">Notifications</p>
        <p v-if="!isAuthenticated" class="dropdown-content">
          Please
          <nuxt-link :to="{ name: 'auth-login' }">login</nuxt-link>
          to see your notifications.
        </p>
        <div v-if="notifications">
          <p v-if="notifications.length === 0" class="dropdown-content">
            You don't have any notifications.
          </p>
          <div class="dropdown-scroll" v-if="notifications.length">
            <transition-group name="notification">
              <div class="hc__notification option" v-for="notification in notifications" :key="notification._id"
                   @click="followNotification(notification)">
                <author :post="notification.comment"></author>
                <p class="notification-message" v-html="notification.message"></p>
              </div>
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
  import author from '~/components/Author/Author.vue'

  export default {
    name: 'hc-notifications',
    components: {
      'author': author
    },
    data () {
      return {
        ready: false,
        active: false
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        notifications: 'notifications/all'
      })
    },
    methods: {
      ...mapMutations({
        addNotification: 'notifications/add'
      }),
      followNotification (notification) {
        this.$router.push(`/contributions/${notification.contribution.slug}`)
        this.active = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .nav-item {
    position: relative;
  }

  .hc__notifications.dropdown {
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

    .box {
      padding: 0;
      width: 300px;
      transform: translateY(-50%) translateX(-50%);
      z-index: 1001;
      box-shadow: $card-shadow-hover;
      overflow: hidden;
      // box-shadow: 0 2px 10px rgba(0, 0, 0, .4);

      @include desktop() {
        position: absolute;
        top: 100%;
        margin-top: 1px;
        left: 50% !important;
        transform: translateX(-50%);
      }
    }

    .dropdown-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba($black, 0.4);
      z-index: 1000;
      @include desktop() {
        display: none;
      }
    }

    .dropdown-title {
      font-weight: $weight-bold;
      margin-bottom: 0.2em;
      padding: 0.5rem 1rem 0.7rem;
      border-bottom: 1px solid $grey-lighter;
    }

    .dropdown-scroll {
      overflow: auto;
      max-height: 400px;
    }

    .option {
      border-bottom: 1px solid lighten($grey-lighter, 6%);
      transition: all .2s ease-out;
      padding: 8px 8px;
      cursor: pointer;

      &:hover {
        // box-shadow: 0px 2px 7px rgba($black, 0.2);
        background-color: lighten($grey-lighter, 10%);
      }

      &:last-of-type {
        border-bottom: 0;
      }
    }

    .notification-message {
      margin-top: 0.5em;
    }

    .dropdown-content {
      padding: 0.5rem 1rem 0.8rem;
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

  .hc__notification {
    p {
      font-size: $size-7;
    }
  }
</style>