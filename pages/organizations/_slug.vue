<template>
  <section class="container organization-profile"
           style="position: relative">
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
                       :preview-image="form.logo || organization.logo"
                       :test="true"
                       @update="onLogoUploadCompleted"
                       @start-sending="uploadingLogo = true"
                       @stop-sending="uploadingLogo = false" ></hc-upload>
            <img :src="organization.logo" v-if="!isOwner" alt="" class="avatar">
          </div>
          <div class="edit-wrapper has-text-right" v-if="canEdit">
            <i class="fa fa-wrench" @click.prevent="edit(organization._id)"></i>
          </div>
          <div class="organization-name">
            <span>{{ organization.name || '' }}</span>
          </div>
          <div class="organization-follows hc-textcounters under-construction">
            <hc-textcount class="textcountitem" :count="1337" :text="$t('page.organization.shouts', 'Zurufe')">
              <div class="action-button">
                <i class="fa fa-bullhorn is-action-icon"></i>
              </div>
            </hc-textcount>
            <hc-textcount class="textcountitem" :count="followerCount" :text="$t('page.organization.supporter', 'Helfer')">
              <div class="action-button">
                <i @click="followOrganization" class="fa fa-bell-o is-action-icon"></i>
              </div>
            </hc-textcount>
          </div>
        </hc-box>
        <!-- TODO: get better looking interactions -->
        <div class="organization-actions" v-if="false">
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
          <div class="content" v-html="organization.description"></div>
        </hc-box>
        <hc-title>Aktiv werden</hc-title>
        <div class="under-construction">
          <hc-box top="true">
            <div class="organization-call-to-action">Crowdplanting am 31.02.2018, Klicke auf diese Zeitmaschine um mehr zu erfahren!</div>
          </hc-box>
        </div>
        <hc-title>{{ $t('page.organization.more', 'Spenden & Mehr') }}</hc-title>
        <div class="under-construction">
          <hc-box top="true">
            <div class="organization-welcome">Spende hier für mehr Bäume und Obst!</div>
          </hc-box>
        </div>
        <div class="under-construction">
          <hc-box top="true" class="organization-faq-box">
            <h3>{{ $t('page.organization.faqTitle', 'Fragen & Antworten') }}</h3>
          </hc-box>
        </div>
      </div>
      <div class="column is-8-tablet is-9-widescreen organization-timeline">
        <hc-title>{{ $t('page.organization.welcome', 'Willkommen') }}</hc-title>
        <organization-review-banner v-if="user && !organization.reviewedBy" :user="user" :organization="organization" :disableReview="true" />
        <organization-visibility-banner v-else-if="user" :user="user" :organization="organization" />
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  import { isEmpty, indexOf } from 'lodash'
  import HcTextcount from '../../components/Global/Typography/Textcount/Textcount'
  import OrganizationReviewBanner from '~/components/Organizations/OrganizationReviewBanner.vue'
  import OrganizationVisibilityBanner from '~/components/Organizations/OrganizationVisibilityBanner.vue'

  export default {
    components: {
      HcTextcount,
      OrganizationReviewBanner,
      OrganizationVisibilityBanner
    },
    data () {
      return {
        form: {
          coverImg: null,
          logo: null
        },
        uploadingCover: false,
        uploadingLogo: false
      }
    },
    middleware: ['authenticated'],
    async asyncData ({app, params, store, error}) {
      let organization, owner, isOwner
      if (!isEmpty(params) && !isEmpty(params.slug) && params.slug !== undefined) {
        organization = await app.$api.service('organizations').find({
          query: {
            slug: params.slug
          }
        })
      }
      if (!organization || isEmpty(organization.data)) {
        error({ statusCode: 404 })
      } else {
        // is owner?
        owner = store.getters['auth/user']
        isOwner = owner && owner._id === organization.data[0].userId
      }
      return {
        params,
        organization: organization.data[0],
        isOwner
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      }),
      coverImg () {
        if (!isEmpty(this.form.coverImg)) {
          return this.form.coverImg
        } else if (!isEmpty(this.organization.thumbnails) && !isEmpty(this.organization.thumbnails.coverImg)) {
          return this.organization.thumbnails.coverImg.cover
        } else if (!isEmpty(this.organization.coverImg)) {
          return this.organization.coverImg
        } else {
          return ''
        }
      },
      followerCount () {
        return this.organization.followerIds.length
      },
      canEdit() {
        return ['admin', 'moderator'].includes(this.user.role) !== false || this.organization.userId === this.user._id
      }
    },
    methods: {
      async followOrganization () {
        let currentUser = this.$store.getters['auth/user']
        let organizationId = this.organization._id
        if (indexOf(this.organization.followerIds, currentUser._id) <= 0) {
          const res = await this.$store.dispatch('organizations/follow', {
            currentUserId: currentUser._id,
            organizationId: organizationId
          })
          console.log('#res', res)

          if (!isEmpty(res.id)) {
            this.$snackbar.open({
              message: this.$t('actions.follow', { name: this.organization.name }),
              type: 'is-success'
            })
          }
        }
      },
      edit(id) {
        this.$router.push({name: 'organizations-settings', query: {id}})
      },
      onCoverUploadCompleted (value) {
        this.form.coverImg = value
        this.organization.coverImg = value
        this.$store.dispatch('organizations/patch', this.organization)
      },
      onLogoUploadCompleted (value) {
        this.form.logo = value
        this.organization.logo = value
        this.$store.dispatch('organizations/patch', this.organization)
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
    .textcountitem,
    .textcountitem span {
      text-align: center !important;
    }
    .action-button {
      margin-bottom: 1em;
    }
    .is-action-icon {
      color: $green;
      font-size: 24px;
      padding: 0px 25px;
      cursor: pointer;
    }

    .editlayer {
      position: fixed;
      background: rgba(0, 0, 0, 0.7);
      z-index: 100;
      width: 100%;
      height: 100%;
      transform: translateY(-50%) translateX(-50.5%);
      left: 50vw;
      top: 50vh;
    }

    .organization-form-wrapper {
      box-shadow: $card-shadow-hover;
    }

    &.blocked {
      .organization-form-wrapper {
        position: relative;
        z-index: 101;
        // background: #fff;
        // padding: 15px;
      }
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
        border-right: 1px solid #dadada;
        padding: 0 10px 0 10px;
      }
      .textcountitem:last-child {
        border-right: 0;
      }
    }

    .organization-sidebar-right {
      h3 {
        text-align: center;
      }
    }

    .edit-wrapper {
      .fa-wrench {
        color: $grey-light;
        cursor: pointer;
        &:hover {
          color: $grey-dark;
        }
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
          // border-left: 1px solid $grey-lighter;
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
