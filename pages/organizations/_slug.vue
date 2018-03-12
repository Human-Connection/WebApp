<template>
  <section class="container organization-profile" style="position: relative">
    <hc-upload class="profile-header card"
               :preview-image="coverImg"
               :test="true"
               @update="onCoverUploadCompleted"
               @start-sending="uploadingCover = true"
               @stop-sending="uploadingCover = false" >
    </hc-upload>
    <div class="columns">
      <div class="column is-4-tablet is-3-widescreen organization-sidebar">
        <hc-box top="true" class="organization-hc-box">
          <div class="organization-avatar">
            <hc-upload class="avatar-upload"
                       :preview-image="form.avatar || organization.logo"
                       :test="true"
                       @update="onAvatarUploadCompleted"
                       @start-sending="uploadingAvatar = true"
                       @stop-sending="uploadingAvatar = false" ></hc-upload>
          </div>
          <div class="organization-name">{{ organization.name }}</div>
        </hc-box>
        <hc-title>Über uns</hc-title>
        <hc-box top="true">
          <div class="organization-welcome">Pacific argentine gopher rockfish, jawfish plaice yellowfin cutthroat trout sixgill ray chimaera leopard danio. Damselfish yellowtail clownfish bristlenose catfish sea catfish blue whiting. Alaska blackfish slender mola hagfish, collared dogfish Kafue pike river loach Black pickerel rock beauty bluefin tuna northern sea robin. Luderick trumpeter whiting whiting common carp yellow-and-black triplefin silver carp, "whale catfish neon tetra." Bonytail chub gray mullet, "candlefish," Black sea bass brook trout freshwater hatchetfish North Pacific daggertooth. Goldspotted killifish, flabby whalefish ribbonfish Black scalyfin Indian mul righteye flounder tarwhine.</div>
        </hc-box>
        <hc-title>Aktiv werden</hc-title>
        <hc-box top="true">
          <div class="organization-welcome">Spende hier für mehr Bäume und Obst!</div>
        </hc-box>
        <hc-box top="true">
          <div class="organization-welcome">Crowdplanting am 31.02.2018, Klicke auf diese Zeitmaschine um mehr zu erfahren!</div>
        </hc-box>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  import { isEmpty } from 'lodash'

  export default {
    components: {
    },
    data () {
      return {
        form: {
          coverImg: null,
          avatar: null
        },
        uploadingCover: false,
        uploadingAvatar: false
      }
    },
    middleware: ['authenticated'],
    async asyncData ({app, params}) {
      let organization
      if (!isEmpty(params) && !isEmpty(params.slug) && params.slug !== undefined) {
        organization = await app.$api.service('organizations').find({
          query: {
            slug: params.slug
          }
        })
      } else {
        throw new Error(404)
      }

      return {
        params: params,
        organization: organization.data[0]
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated'
      }),
      coverImg () {
        if (!isEmpty(this.form.coverImg)) {
          return this.form.coverImg
        } else if (!isEmpty(this.organization.thumbnails) && !isEmpty(this.organization.thumbnails.coverImg)) {
          return this.organization.thumbnails.coverImg.cover
        } else if (!isEmpty(this.organization.coverImg)) {
          return this.organization.coverImg
        } else {
          return 'https://source.unsplash.com/random/1250x280'
        }
      }
    },
    methods: {
      onCoverUploadCompleted (value) {
        this.form.coverImg = value
        this.$store.dispatch('auth/patch', {
          coverImg: value
        })
      },
      onAvatarUploadCompleted (value) {
        this.form.avatar = value
        this.$store.dispatch('auth/patch', {
          avatar: value
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .organization-profile {
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

    .organization-sidebar {
      min-height: 200px;

      .organization-hc-box {
        position: relative;
        $borderRadius: 50%;

        .organization-avatar {
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
            & {
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

        .organization-name {
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          padding-top: 60px;
        }
      }
    }
  }
</style>
