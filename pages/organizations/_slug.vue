<template>
  <section class="container organization-profile" style="position: relative">
    <hc-upload class="profile-header card"
               v-if="isOwner"
               :preview-image="coverImg"
               :test="true"
               @update="onCoverUploadCompleted"
               @start-sending="uploadingCover = true"
               @stop-sending="uploadingCover = false" >
    </hc-upload>
    <img :src="coverImg" v-if="!isOwner" alt="" class="profile-header card">
    <div class="columns">
      <div class="column is-4-tablet is-3-widescreen organization-sidebar-left">
        <hc-box top="true" class="organization-hc-box">
          <div class="organization-avatar">
            <hc-upload class="avatar-upload"
                       v-if="isOwner"
                       :preview-image="form.avatar || organization.logo"
                       :test="true"
                       @update="onAvatarUploadCompleted"
                       @start-sending="uploadingAvatar = true"
                       @stop-sending="uploadingAvatar = false" ></hc-upload>
            <img :src="organization.logo" v-if="!isOwner" alt="" class="avatar">
          </div>
          <div class="organization-name">{{ organization.name }}</div>
          <div class="organization-follows">
            <hc-textcount class="textcountitem" :count="1337" :text="$t('page.organization.shouts', 'Zurufe')"/>
            <hc-textcount class="textcountitem" :count="369" :text="$t('page.organization.supporter', 'Helfer')"/>
          </div>
        </hc-box>
        <div class="organization-actions">
          <hc-box top="true" class="organization-action">
            <i class="fa fa-envelope"></i>
          </hc-box>
          <hc-box top="true" class="organization-action">
            <i class="fa fa-bookmark"></i>
          </hc-box>
          <hc-box top="true" class="organization-action">
            <i class="fa fa-image"></i>
          </hc-box>
          <hc-box top="true" class="organization-action">
            <i class="fa fa-ellipsis-h"></i>
          </hc-box>
        </div>
        <div class="title-wrapper">
          <hc-title>{{ $t('page.organization.aboutUs', 'Über uns') }}</hc-title>
        </div>
        <hc-box top="true">
          <div class="organization-welcome">{{ organization.description }}</div>
        </hc-box>
        <hc-title>Aktiv werden</hc-title>
        <hc-box top="true">
          <div class="organization-call-to-action">Crowdplanting am 31.02.2018, Klicke auf diese Zeitmaschine um mehr zu erfahren!</div>
        </hc-box>
      </div>
      <div class="column is-5-tablet is-6-widescreen organization-timeline">
        <hc-title>{{ $t('page.organization.welcome', 'Willkommen') }}</hc-title>
        <!-- TODO: add timeline for organizations -->
      </div>
      <div class="column is-3-tablet is-3-widescreen organization-sidebar-right">
        <hc-title>{{ $t('page.organization.more', 'Spenden & Mehr') }}</hc-title>
        <hc-box top="true">
          <div class="organization-welcome">Spende hier für mehr Bäume und Obst!</div>
        </hc-box>
        <hc-box top="true" class="organization-faq-box">
          <h3>{{ $t('page.organization.faqTitle', 'Fragen & Antworten') }}</h3>
        </hc-box>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import feathers from '~/plugins/feathers'

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
    async asyncData ({params, store}) {
      let organization, owner, isOwner
      if (!isEmpty(params) && !isEmpty(params.slug) && params.slug !== undefined) {
        organization = await feathers.service('organizations').find({
          query: {
            slug: params.slug
          }
        })
      } else {
        throw new Error(404)
      }
      // is owner?
      owner = store.getters['auth/user']
      isOwner = owner !== null && owner._id === organization.data[0].userId
      return {
        params: params,
        organization: organization.data[0],
        isOwner: isOwner
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
    },
    head () {
      return {
        title: this.organization.name
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

    .avatar {
      border: none;
      border-radius: 50%;
    }

    .organization-follows {
      display: flex;
      justify-content: center;
      margin: 25px 0;

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

    .organization-sidebar-right {
      h3 {
        text-align: center;
      }
    }

    .organization-sidebar-left {
      min-height: 200px;

      .title-wrapper {
        clear: both;
      }

      .organization-actions {
        .organization-action {
          width: 25%;
          float: left;
          text-align: center;
          border-left: 1px solid $grey-lighter;
          i {
            font-size: 18px;
            color: $grey-light;
          }
          &:first-child {
            border-left: none !important;
          }
          &:hover {
            cursor: pointer;
            i {
              color: $grey-dark;
            }
          }
        }
      }

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
