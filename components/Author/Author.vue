<template>
  <div :class="{ disabled: disableLink, 'is-owner': isOwner, mask: maskUser }"
    class="media hc__author">
    <div class="media-left" v-if="showAvatar" @click="showProfile">
      <hc-avatar
        :user="getUser"
        :showOnlineStatus="true"
        :imageKey="imageKey" />
    </div>
    <div class="media-content" @click="showProfile" v-if="showText">
      <p class="title" v-if="!user">
        {{ $t('component.contribution.creatorUnknown') }}
      </p>
      <p class="title" v-else>
        {{ getUser.name }}
      </p>
      <p class="subtitle">
        <i class="fa fa-clock-o"></i>&nbsp;
        <hc-relative-date-time :dateTime="createdAt"></hc-relative-date-time>
      </p>
    </div>
    <slot>
    </slot>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash'

  export default {
    name: 'hc-author',
    props: {
      user: {
        type: Object
      },
      createdAt: {
        type: [ String, Date ]
      },
      isOwner: {
        type: Boolean
      },
      isAuthor: {
        type: Boolean
      },
      showAvatar: {
        type: Boolean,
        default: true
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      showProfile () {
        if (this.user.userId) {
          // its an organization
          this.$router.push(`/organizations/${this.user.slug}`)
        } else if (this.isOwnProfile) {
          // own profile
          this.$router.push(`/profile/`)
        } else if (this.getUser.slug) {
          // foreign profile
          this.$router.push(`/profile/${this.getUser.slug}`)
        }
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        currentUserSettings: 'auth/userSettings'
      }),
      imageKey () {
        return (this.user && this.user.logo) ? 'logo' : 'avatar'
      },
      getUser () {
        return Object.assign({
          _id: null,
          slug: null,
          name: this.$t('component.contribution.creatorUnknown'),
          avatar: null
        }, this.user)
      },
      isOwnProfile () {
        return this.currentUser && this.currentUser._id === this.getUser._id
      },
      disableLink () {
        return (!this.isOwnProfile && !this.getUser.slug)
      },
      maskUser () {
        if (!this.currentUserSettings || !this.currentUserSettings.hideUsersWithoutTermsOfUseSigniture) {
          return false
        }
        return isEmpty(this.getUser.termsAndConditionsAccepted)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .hc__author {
    &.is-owner {
      .title {
        background-color: $primary;
        display: inline-block;
        padding: .2rem .35rem;
        border-radius: 3px;
        color: $white;
      }
    }

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
          color:       $grey;
          font-size:   $size-7;

          .fa {
              font-size:  12px;
              margin-top: -0.8em;
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

      &.mask {
        opacity: .5;
        filter: blur(3px);
      }
  }
</style>
