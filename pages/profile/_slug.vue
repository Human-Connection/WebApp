<template>
  <section class="container page-profile" style="position: relative">
    <template>
      <hc-upload
        class="profile-header card"
        v-if="isOwner"
        :preview-image="coverImg"
        :test="true"
        @update="onCoverUploadCompleted"
        @start-sending="uploadingCover = true"
        @stop-sending="uploadingCover = false">
      </hc-upload>
      <hc-progressive-image
          class="profile-header card"
          v-else
          :src="coverImg"
          :preview="coverPreview" />
    </template>
    <div class="columns">
      <div class="column is-4-tablet is-3-widescreen user-sidebar">
        <hc-box top="true" class="user-hc-box">
          <div class="user-avatar">
            <template>
              <hc-upload
                v-if="isOwner"
                class="avatar-upload"
                :preview-image="form.avatar || user.avatar"
                :test="true"
                @update="onAvatarUploadCompleted"
                @start-sending="uploadingAvatar = true"
                @stop-sending="uploadingAvatar = false" >
                <hc-avatar class="is-big" :user="user" />
              </hc-upload>
              <hc-avatar v-else :showOnlineStatus="true" class="is-big avatar-upload" :class="{ mask: maskUser }" :user="user" />
            </template>
          </div>
          <div class="user-name" :class="{ mask: maskUser }">{{ user.name }}</div>
          <template v-if="user && user.badges && user.badges.length">
            <hc-profile-badges :title="$t('auth.account.myBadgeOnePluralNone', null, 2)" :badges="user.badges" />
          </template>
          <hc-follow-buttons v-if="user"
                             :showButtons="!isOwner"
                             :entity="user">
          </hc-follow-buttons>

          <div v-if="false" class="hc-shortcuts level under-construction">
            <!-- TODO: replace the cdn images with local hc icons -->
            <div class="level-item has-text-centered">
              <div>
                <img
                  src="https://cdn.frontify.com/api/screen/thumbnail/gjtyyT-91-nld9zkg6pHvZScdj53BVk0JfE8Sw6FhH9BiqTXfzYSLzzDuu8QB_aqQYMeiYMpaSQBC6WHt8DteA/1524"
                  alt=""/>
              </div>
              <span>{{ $t('auth.account.myMessagesOnePluralNone', null, 1) }}</span>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <img
                  src="https://cdn.frontify.com/api/screen/thumbnail/1fqGheyFlTsQPstpdVg9SR8wfemIhyOStsyENZcKEKtMiLxld4pStcUBPSFBIKum4P5xe_ZyEY9BDGF4KyTFiA/1539"
                  alt=""/>
              </div>
              <span>{{ $t('auth.account.myFollowersBrief') }}</span>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <img
                  src="https://cdn.frontify.com/api/screen/thumbnail/Ed0RNoWMNm8YoAQp3GScFQMGi9BNPozGyBPL4Ov-fpjh6VnBCfS6bj2PBXlAUDtpUMxuydlCPfyy4_fFvcIewQ/1524"
                  alt=""/>
              </div>
              <span>{{ $t('auth.account.myBookmarksBriefOrLong', null, 1) }}</span>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <img
                  src="https://cdn.frontify.com/api/screen/thumbnail/j59T8yA8_NwQQdrtbqrgxYyKoKbZaVTT9zaEBOPOsRiHF4TbmlDuGrJcUYbp7OJ7z0HmFWl-rDEvGnjUJdEVDA/1524"
                  alt=""/>
              </div>
              <span>{{ $t('auth.account.myGallery') }}</span>
            </div>
            <div class="level-item has-text-centered">
              <hc-icon style="color: #BFBFBF; font-size: 20px;" icon="ellipsis-v"></hc-icon>
              <span>{{ $t('auth.account.myMore') }}</span>
            </div>
          </div>
        </hc-box>
        <hc-title>{{ $t('auth.account.myNetwork', 'Netzwerk') }}</hc-title>
        <hc-box class="" bottom="true">
          <hc-subtitle>{{ $t('auth.account.myFollowing', 'Following') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" :count="followingCounts.organizations" :text="$t('auth.account.myFollowingNgoOnePluralNone', null, followingCounts.organizations)"/>
            <hc-textcount class="textcountitem" :count="followingCounts.users" :text="$t('auth.account.myFollowingPeopleOnePluralNone', null, followingCounts.users)"/>
            <hc-textcount class="textcountitem" :count="followingCounts.projects" :text="$t('auth.account.myFollowingProjectsOnePluralNone', null, followingCounts.projects)"/>
          </div>
          <div class="hc-follower-list">
            <hc-follower-item v-for="item in following.users.data" :key="item._id" :user="item.user" />
          </div>
        </hc-box>
        <hc-box class="under-construction" bottom="true">
          <hc-subtitle>{{ $t('auth.account.myInterests', 'Interessen') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" :count="14" :text="$t('auth.account.myBookmarksBriefOrLong', null, 2)"/>
            <hc-textcount class="textcountitem" :count="5" :text="$t('auth.account.mySearch')"/>
          </div>
        </hc-box>
        <hc-box class="under-construction" bottom="true">
          <hc-subtitle>{{ $t('auth.account.myMap', 'Karte') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" :count="14" :text="$t('auth.account.myBookmarksBriefOrLong', null, 2)"/>
            <hc-textcount class="textcountitem" :count="5" :text="$t('auth.account.mySearch')"/>
          </div>
          <hc-map style="margin: 0 -14px -14px -14px;" :places="places" :zoom="zoom" :center="center" :token="$env.MAPBOX_TOKEN" />
        </hc-box>
        <hc-box class="under-construction">
          <hc-subtitle>{{ $t('auth.account.myConnections', 'My Friends') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" :count="14" :text="$t('auth.account.myBookmarksBriefOrLong', null, 2)"/>
            <hc-textcount class="textcountitem" :count="5" :text="$t('auth.account.mySearch')"/>
          </div>
        </hc-box>
        <hc-title>{{ $t('auth.account.myDoings', 'Aktionen') }}</hc-title>
        <hc-box :isLoading="isLoadingCanDos">
          <hc-subtitle>{{ $t('auth.account.myCanDos', 'Meine Can Do’s') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" :count="user.candos" :text="$t('auth.account.myCanDosAltogether', 'Can Do’s')"/>
            <hc-textcount class="textcountitem" :count="user.candos.filter(({done}) => !!done)" :text="$t('auth.account.myCanDosDone', 'geschafft')"/>
          </div>
          <ul class="is-list">
            <li v-for="canDo in candos" :key="canDo._id">
              <hc-button type="link" :to="{name:'contributions-slug', params: {slug: canDo.slug}}">
                <hc-truncate :text="canDo.title" length=30 :options="{seperator: ''}" />
              </hc-button>
            </li>
          </ul>
        </hc-box>
      </div>
      <hc-timeline v-if="user" :user="user" />
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import FollowerItem from '~/components/Profile/FollowerItem/FollowerItem.vue'
  import FollowButtons from '~/components/Global/Elements/Follow/FollowButtons.vue'
  import Map from '~/components/Map/Map.vue'
  import Timeline from '~/components/layout/Timeline'
  import Badges from '~/components/Profile/Badges/Badges'
  import thumbnailHelper from '~/helpers/thumbnails'
  import { isEmpty, flatMap } from 'lodash'

  export default {
    components: {
      'hc-follower-item': FollowerItem,
      'hc-follow-buttons': FollowButtons,
      'hc-profile-badges': Badges,
      'hc-map': Map,
      'hc-timeline': Timeline
    },
    data () {
      return {
        places: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
          },
          properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.414, 37.776]
          },
          properties: {
            title: 'Mapbox',
            description: 'San Francisco, California'
          }
        }],
        zoom: 1.5,
        center: {
          lng: -102.0073,
          lat: 40.7124
        },
        following: {
          users: { total: 0, data: [] },
          organizations: { total: 0, data: [] },
          projects: { total: 0, data: [] }
        },
        form: {
          coverImg: null,
          avatar: null
        },
        uploadingCover: false,
        uploadingAvatar: false,
        user: null,
        isOwner: false,
        params: null,
        updatedUser: null,
        candos: [],
        isLoadingCanDos: false
      }
    },
    middleware: ['authenticated'],
    async asyncData ({ app, params, store, error }) {
      let user
      let isOwner = false
      if (!isEmpty(params) && !isEmpty(params.slug)) {
        const res = await app.$api.service('users').find({
          query: {
            slug: params.slug
          }
        })
        user = res.data[0]
      } else {
        user = store.getters['auth/user']
        isOwner = true
      }
      if (!user) {
        error({ statusCode: 404 })
      }
      return {
        params: params,
        user: user,
        isOwner: isOwner,
        updatedUser: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        loggedInUser: 'auth/user',
        currentUserSettings: "auth/userSettings"
      }),
      followingCounts () {
        return {
          users: this.user && this.user.followingCounts ? (this.user.followingCounts.users || 0) : 0,
          organizations: this.user && this.user.followingCounts ? (this.user.followingCounts.organizations || 0) : 0,
          projects: this.user && this.user.followingCounts ? (this.user.followingCounts.projects || 0) : 0
        }
      },
      coverImg () {
        let thumbnail = thumbnailHelper.getThumbnail(this.updatedUser || this.user, 'coverImg', 'cover')
        if (!thumbnail && this.user.wasSeeded && !this.isOwner) {
          thumbnail = 'https://source.unsplash.com/random/1250x280'
        }
        return thumbnail
      },
      coverPreview () {
        return thumbnailHelper.getThumbnail(this.user, 'coverImg', 'coverPlaceholder', this.coverImg)
      },
      maskUser () {
        if (!this.user) {
          return false
        }
        if (!this.currentUserSettings || !this.currentUserSettings.hideUsersWithoutTermsOfUseSigniture) {
          return false
        }
        return isEmpty(this.user.termsAndConditionsAccepted)
      }
    },
    methods: {
      async onCoverUploadCompleted (value) {
        this.form.coverImg = value
        const user = await this.$store.dispatch('auth/patch', {
          coverImg: value
        })
        this.updatedUser = user
      },
      async onAvatarUploadCompleted (value) {
        this.form.avatar = value
        const user = await this.$store.dispatch('auth/patch', {
          avatar: value
        })
        this.updatedUser = user
      },
      async loadFollows (service = 'users') {
        try {
          const res = await this.$api.service('follows').find({
            query: {
              userId: this.user._id,
              foreignService: service,
              $limit: 5,
              $sort: {
                createdAt: -1
              }
            }
          })
          this.$set(this.following, service, res)
        } catch (err) {}
      },
      async loadCandos () {
        if (this.user.candos && this.user.candos.length) {
          this.isLoadingCanDos = true
        }
        try {
          const res = await this.$api.service('contributions').find({
            query: {
              _id: {
                $in: flatMap(this.user.candos, 'contributionId')
              },
              type: 'cando',
              $limit: 5,
              $sort: {
                createdAt: -1
              }
            }
          })
          this.candos = res.data
        } catch (err) {}
        this.isLoadingCanDos = false
      }
    },
    mounted () {
      this.$nextTick(() => {
        try {
          this.loadFollows()
          this.loadCandos()
        } catch (err) {}
      })
    },
    head () {
      return {
        title: this.$t('auth.account.myProfile', 'Profile')
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .page-profile {

    .mask {
      filter: blur(5px);
      opacity: .5;
    }

    #main {
      margin-top: 0;
    }

    .profile-header {
      width: 100%;
      height: 312px;
      max-height: 312px;
      overflow: hidden;
      position: relative;
      background-color: darkgrey;
      background-size: cover;
      background-position: center;

      border: none;
      box-shadow: $card-shadow;
    }

    .user-sidebar {
      min-height: 200px;

      .user-hc-box {
        position: relative;
        $borderRadius: 50%;

        .user-avatar {
          border-radius: $borderRadius;
          width:         130px;
          height:        130px;
          position:      absolute;
          top:           0;
          left:          50%;
          transform:     translateX(-50%) translateY(-50%);
          border:        5px solid white;
          display:       inline-block;
          background-color: #fff;

          .avatar-upload {
            &, & > div {
              border:        none;
              border-radius: $borderRadius;
              overflow:      hidden;
              width:         100%;
              height:        100%;
              max-height:    100%;
              min-height:    100%;
              max-width:     100%;
              min-width:     100%;
            }
          }
        }

        .user-name {
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          padding-top: 60px;
        }
      }
    }

    .hc-shortcuts {
      display: flex;
      justify-content: space-between;

      .level-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        // width: 58px;

        img {
          min-width: 20px;
          display: block;
        }

        span {
          display: block;
          width: 100%;
          padding: 5px 0 0 0;
          font-size: 0.6em;
          text-transform: uppercase;
        }
      }
    }

    .hc-follower-list {
      margin: 15px 0;
    }

    .user-avatar {

      .hc-preview {
        position: relative;
      }

      &:before {
        border-radius: 50%;
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        pointer-events: none;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      }

      .hc-upload.sending {
        i.fa {
          opacity: 0;
        }

        .hc-upload-progress {
          bottom: 49% !important;
          z-index: 10;
        }
      }
    }
  }

</style>
