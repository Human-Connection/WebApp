<template>
  <section class="container" style="position: relative">
    <div class="profile-header card">
        <img :src="coverImg">
    </div>
    <div class="columns">
      <div class="column user-sidebar">
        <hc-box top="true" class="user-hc-box">
          <div class="user-avatar">
            <upload-avatar class="avatar-upload"></upload-avatar>
          </div>

          <!--<div class="user-avatar" v-bind:style="{'background-image': 'url(' + user.avatar + ')'}">-->
            <!--&nbsp;-->
          <!--</div>-->
          <div class="user-name">{{ user.name }}</div>
          <hc-profile-badges :title="$t('auth.account.myBadgeOnePluralNone', null, 2)" :badges="user.badges" />
        </hc-box>
        <div class="hc-shortcuts">
          <hc-box class="shortcut-hc-box" top="true">
            <img
              src="https://cdn.frontify.com/api/screen/thumbnail/gjtyyT-91-nld9zkg6pHvZScdj53BVk0JfE8Sw6FhH9BiqTXfzYSLzzDuu8QB_aqQYMeiYMpaSQBC6WHt8DteA/1524"
              alt=""/>
            <span>{{ $t('auth.account.myMessagesOnePluralNone', null, 1) }}</span>
          </hc-box>
          <hc-box class="shortcut-hc-box" top="true">
            <img
              src="https://cdn.frontify.com/api/screen/thumbnail/1fqGheyFlTsQPstpdVg9SR8wfemIhyOStsyENZcKEKtMiLxld4pStcUBPSFBIKum4P5xe_ZyEY9BDGF4KyTFiA/1539"
              alt=""/>
            <span>{{ $t('auth.account.myFollowersBrief') }}</span>
          </hc-box>
          <hc-box class="shortcut-hc-box" top="true">
            <img
              src="https://cdn.frontify.com/api/screen/thumbnail/Ed0RNoWMNm8YoAQp3GScFQMGi9BNPozGyBPL4Ov-fpjh6VnBCfS6bj2PBXlAUDtpUMxuydlCPfyy4_fFvcIewQ/1524"
              alt=""/>
            <span>{{ $t('auth.account.myBookmarksBriefOrLong', null, 1) }}</span>
          </hc-box>
          <hc-box class="shortcut-hc-box" top="true">
            <img
              src="https://cdn.frontify.com/api/screen/thumbnail/j59T8yA8_NwQQdrtbqrgxYyKoKbZaVTT9zaEBOPOsRiHF4TbmlDuGrJcUYbp7OJ7z0HmFWl-rDEvGnjUJdEVDA/1524"
              alt=""/>
            <span>{{ $t('auth.account.myGallery') }}</span>
          </hc-box>
          <hc-box class="shortcut-hc-box" top="true">
            <img
              src="https://cdn.frontify.com/api/screen/thumbnail/zXWlGFPuTJ3QEFCh0VyZUHWeAWkBNpOZU477LcCa96jl0zCr6GJDgLrVZ-ozVxp0oipIu2k61Vz9geCvM_F6GQ/1524"
              alt=""/>
            <span>{{ $t('auth.account.myMore') }}</span>
          </hc-box>
        </div>
        <hc-box top="true" bottom="true">
          <hc-title>{{ $t('auth.account.myNetwork', 'Netzwerk') }}</hc-title>
        </hc-box>
        <hc-box bottom="true">
          <hc-subtitle>{{ $t('auth.account.myFollowing', 'Following') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" :count="following.organizations" :text="$t('auth.account.myFollowingNgoOnePluralNone', null, following.organizations.length)"/>
            <hc-textcount class="textcountitem" :count="following.users" :text="$t('auth.account.myFollowingPeopleOnePluralNone', null, following.users.length)"/>
            <hc-textcount class="textcountitem" :count="following.projects" :text="$t('auth.account.myFollowingProjectsOnePluralNone', null, following.projects.length)"/>
          </div>
          <!--<hc-dropdown :showLabels="[$t('auth.account.myFollowingShowAll'), $t('auth.account.myFollowingShowMine')]"
                       :sortLabels="[$t('auth.account.myFollowingSortBy'), $t('auth.account.myFollowingSortByDate'), $t('auth.account.myFollowingSortByCategory')]"/>-->
          <div class="hc-follower-list">
            <hc-follower-item v-for="user in following.users" :key="user._id" :title="user.name" :image="user.avatar" timestamp="vor 3 Tagen"/>
          </div>
        </hc-box>
        <hc-box bottom="true">
          <hc-subtitle>{{ $t('auth.account.myInterests', 'Interessen') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" count="14" :text="$t('auth.account.myBookmarksBriefOrLong', null, 2)"/>
            <hc-textcount class="textcountitem" count="5" :text="$t('auth.account.mySearch')"/>
          </div>
        </hc-box>
        <hc-box bottom="true">
          <hc-subtitle>{{ $t('auth.account.myMap', 'Karte') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" count="14" :text="$t('auth.account.myBookmarksBriefOrLong', null, 2)"/>
            <hc-textcount class="textcountitem" count="5" :text="$t('auth.account.mySearch')"/>
          </div>
        </hc-box>
        <hc-box>
          <hc-subtitle>{{ $t('auth.account.myConnections', 'My Friends') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" count="14" :text="$t('auth.account.myBookmarksBriefOrLong', null, 2)"/>
            <hc-textcount class="textcountitem" count="5" :text="$t('auth.account.mySearch')"/>
          </div>
        </hc-box>
      </div>
      <hc-timeline />
      <div class="column actions-sidebar">
        <hc-box top="true" bottom="true">
          <hc-title>{{ $t('auth.account.myDoings', 'Aktionen') }}</hc-title>
        </hc-box>
        <hc-box>
          <hc-subtitle>{{ $t('auth.account.myCanDos', 'Meine Can Do’s') }}</hc-subtitle>
          <div class="hc-textcounters">
            <hc-textcount class="textcountitem" count="5" :text="$t('auth.account.myCanDosAltogether', 'Can Do’s')"/>
            <hc-textcount class="textcountitem" count="3" :text="$t('auth.account.myCanDosDone', 'geschafft')"/>
          </div>
          <hc-map :places="places" :zoom="zoom" :center="center" />
        </hc-box>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import FollowerItem from '~/components/Profile/FollowerItem/FollowerItem.vue'
  import Map from '~/components/Map/Map.vue'
  import UploadAvatar from '~/components/User/UploadAvatar'
  import Timeline from '~/components/layout/Timeline'
  import Badges from '~/components/Profile/Badges/Badges'
  import feathers from '~/plugins/feathers'

  export default {
    components: {
      'hc-follower-item': FollowerItem,
      'upload-avatar': UploadAvatar,
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
          users: [],
          organizations: [],
          projects: []
        }
      }
    },
    middleware: ['authenticated'],
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      }),
      coverImg () {
        return this.user.coverImg ? this.user.coverImg : 'https://source.unsplash.com/random/1250x280'
      }
    },
    async mounted () {
      const user = await feathers.service('follows').get(this.user._id)
      this.following = {
        users: user.users || [],
        organizations: user.organizations || [],
        projects: user.projects || []
      }
      return true
    },
    head () {
      return {
        title: this.$t('auth.account.myProfile', 'Profile')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  #main {
    margin-top: 0;
  }

  .profile-header {
    width: 100%;
    height: 243px;
    max-height: 243px;
    overflow: hidden;
    position: relative;
    background: darkgrey;

    border: none;
    box-shadow: $card-shadow;

    img {
      width: 100%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }


  .user-sidebar {
    min-height: 200px;

    .user-hc-box {
      position: relative;

      .user-avatar {
        border-radius: 130px;
        width:         130px;
        height:        130px;
        position:      absolute;
        top:           0;
        left:          50%;
        transform:     translateX(-50%) translateY(-50%);
        border:        5px solid white;
        display:       inline-block;

        .avatar-upload {
          border:     none;
          width:      100%;
          height:     100%;
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
    .shortcut-hc-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 58px;

      img {
        width: 20px;
      }

      span {
        padding: 5px 0 0 0;
        font-size: 8px;
        text-transform: uppercase;
      }
    }
  }

  .hc-textcounters {
    display: flex;
    justify-content: center;
    margin: 15px 0;

    .textcountitem {
      text-align: center;
      border-right: 1px solid #dadada;
      //border-left: 1px solid #dadada;
      padding: 0 10px 0 10px;
    }
    .textcountitem:first-child {
      text-align: right;
    }
    .textcountitem:last-child {
      text-align: left;
      border-right: 0;
    }
  }

  .hc-follower-list {
    margin: 15px 0;
  }
</style>
