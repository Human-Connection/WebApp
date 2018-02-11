<template>
    <div :class="{ disabled: disableLink }"
         class="media hc__author"
         v-if="post"
         @click="showProfile">
        <div class="media-left">
            <hc-avatar :user="user"></hc-avatar>
        </div>
        <div class="media-content">
            <p class="title" v-if="!post.user">
                {{ $t('component.contribution.creatorUnknown') }}
            </p>
            <p class="title" v-else>
                {{ post.user.name }} </p>
            <p class="subtitle">
                <i class="fa fa-clock-o"></i>&nbsp;
                <hc-relative-date-time :dateTime="post.createdAt"></hc-relative-date-time>
            </p>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash'
  import HcAvatar from '~/components/Avatar/Avatar.vue'
  import HcRelativeDateTime from '~/components/Global/Utilities/RelativeDateTime/RelativeDateTime.vue'

  export default {
    components: {
      HcAvatar,
      HcRelativeDateTime
    },
    name: 'hc-author',
    props: {
      post: {
        type: Object
      }
    },
    methods: {
      showProfile () {
        if (this.isOwnProfile) {
          // own profile
          this.$router.push(`/profile/`)
        } else if (this.slug) {
          // foreign profile
          this.$router.push(`/profile/${this.slug}`)
        }
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      }),
      user () {
        return this.post.user || null
      },
      isOwnProfile () {
        return this.currentUser && this.currentUser._id === this.user._id
      },
      slug () {
        return (this.user && !isEmpty(this.user.slug)) ? this.user.slug : false
      },
      disableLink () {
        return (!this.isOwnProfile && !this.slug)
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
      }
  }
</style>
