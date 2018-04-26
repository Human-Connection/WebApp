<template>
  <div :class="{ disabled: disableLink }"
        class="media hc__author"
        @click="showProfile">
    <div class="media-left">
      <hc-avatar :user="user" :showOnlineStatus="true"></hc-avatar>
    </div>
    <div class="media-content">
      <p class="title" v-if="!user">
        {{ $t('component.contribution.creatorUnknown') }}
      </p>
      <p class="title" v-else>
        {{ user.name || 'Anonymus' }} </p>
      <p class="subtitle">
        <i class="fa fa-clock-o"></i>&nbsp;
        <hc-relative-date-time :dateTime="createdAt"></hc-relative-date-time>
      </p>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'hc-author',
    props: {
      user: {
        type: Object
      },
      createdAt: {
        type: [ String, Date ]
      }
    },
    methods: {
      showProfile () {
        if (this.isOwnProfile) {
          // own profile
          this.$router.push(`/profile/`)
        } else if (this.user.slug) {
          // foreign profile
          this.$router.push(`/profile/${this.user.slug}`)
        }
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      }),
      isOwnProfile () {
        return this.currentUser && this.currentUser._id === this.user._id
      },
      disableLink () {
        return (!this.isOwnProfile && !this.user.slug)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .hc__author {
      cursor: pointer;
      &.disabled {
        cursor: default !important;
        pointer-events: none;
      }
      .profile-image {
          border: none;
          box-shadow:inset 0 0 0 1px rgba(0, 0, 0, .1);
      }

      small {
          display:        block;
          text-align:     center;
          text-transform: uppercase;
          padding:        5px 10px;
          margin:         0 auto;
      }

      .title {
          font-size:     $size-6;
          margin-bottom: 1.5rem;
      }

      .subtitle {
          padding-top: 3px;
          color:       $grey;
          font-size:   $size-7;

          .fa {
              font-size:  12px;
              margin-top: 2px;
              color:      $grey-light;
          }
      }

      .profile-image {
          width:               36px;
          height:              36px;
          background-position: center;
          background-size:     cover;
          transform: translate3d(0,0,0);
      }
  }
</style>
