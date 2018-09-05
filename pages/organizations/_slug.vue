<template>
  <section class="container organization-profile"
           :class="{'has-cover': organization.coverImg || isOwner}"
           style="position: relative">
    <template>
      <hc-upload class="profile-header card"
                v-if="isOwner"
                :preview-image="coverImg"
                :test="true"
                @update="onCoverUploadCompleted"
                @start-sending="uploadingCover = true"
                @stop-sending="uploadingCover = false" >
      </hc-upload>
      <img :src="coverImg" v-else-if="isOwner || organization.coverImg " alt="" class="profile-header card">
    </template>
    <div class="columns">
      <div class="column is-4-tablet is-3-widescreen organization-sidebar-left">
        <hc-box top="true" class="organization-hc-box">
          <div class="organization-avatar">
            <hc-upload class="avatar-upload"
                       v-if="isOwner"
                       :preview-image="form.logo || organization.logo"
                       :test="true"
                       :circular="false"
                       @update="onLogoUploadCompleted"
                       @start-sending="uploadingLogo = true"
                       @stop-sending="uploadingLogo = false" >
              <hc-avatar class="is-big"
                         :user="organization"
                         :crop="false"
                         imageKey="logo" />
            </hc-upload>
            <hc-avatar v-else
                       class="is-big avatar-upload"
                       :user="organization"
                       :crop="false"
                       imageKey="logo" />
          </div>
          <div class="edit-wrapper has-text-right" v-if="canEdit">
            <i class="fa fa-wrench" @click.prevent="edit(organization._id)"></i>
          </div>
          <div class="organization-name">
            <strong>{{ organization.name }}</strong><br />
            <small>{{ $t(`component.organization.types.${organization.type}`) }}</small>
          </div>
          <div class="tags categories" v-if="organization.categories.length">
            <hc-tooltip :label="$t(`component.category.slug2label-${category.slug}`)"
                      v-for="category in organization.categories"
                      :key="category._id"
                      style="margin-right: 5px;"
                      type="is-dark">
                <span class="tag" style="border-radius: 100%; width: 32px; height: 32px; font-size: 1rem; opacity: 0.8;">
                  <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon>
                </span>
            </hc-tooltip>
          </div>
          <hc-follow-buttons v-if="user"
                             service="organizations"
                             :showButtons="!isOwner"
                             :entity="organization" />
          <!--<div class="organization-follows hc-textcounters under-construction">
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
          </div>-->
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
        <hc-title class="title">{{ $t('page.organization.aboutUs', 'Über uns') }}</hc-title>
        <hc-box top="true">
          <div class="content" v-html="organization.description"></div>
        </hc-box>
        <hc-title class="title">Aktiv werden</hc-title>
        <div class="under-construction">
          <hc-box top="true">
            <div class="organization-call-to-action">Crowdplanting am 31.02.2018, Klicke auf diese Zeitmaschine um mehr zu erfahren!</div>
          </hc-box>
        </div>
        <hc-title class="title">{{ $t('page.organization.more', 'Spenden & Mehr') }}</hc-title>
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
        <organization-review-banner v-if="user && !organization.reviewedBy" :user="user" :organization="organization" :disableReview="true" />
        <organization-visibility-banner v-else-if="user" :user="user" :organization="organization" />
        <div class="timeline">
          <div class="timeline-content">
            <div class="timeline-intro" v-if="!contributed.data.length && loadingFinished">
              <p>
                {{ $t('component.timeline.noContributionsFound') }}
              </p>
            </div>
            <div class="timeline-intro" v-if="isOwner">
              <hc-tooltip :label="$t('component.contribution.writePost')"
                          type="is-black"
                          position="is-right">
                <hc-button color="primary"
                          size="large"
                          type="nuxt"
                          circle
                          :to="$router.resolve({name:'contributions-write', query: { organizationId: organization._id }}).href">
                  <hc-icon icon="plus"/>
                </hc-button>
              </hc-tooltip>
            </div>
            <div v-if="isLoading" class="timeline-loader">
              <div class="is-loading"></div>
            </div>
            <div class="timeline-missing-line"></div>
            <div class="timeline-post-wrapper is-clearfix">
              <div class="timeline-post-direction" v-if="!isLoading && contributed.data"
                                                  v-for="contribution in contributed.data"
                                                  :key="contribution._id">
                <contribution-card class="card timeline arrow"
                  :post="contribution" :key="contribution._id">
                  <small slot="category">{{ $t('component.contribution.type-' + contribution.type) }}</small>
                </contribution-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  import { isEmpty, indexOf } from 'lodash'
  import HcTextcount from '~/components/Global/Typography/Textcount/Textcount'
  import FollowButtons from '~/components/Global/Elements/Follow/FollowButtons.vue'
  import ContributionCard from '~/components/Contributions/ContributionCard.vue'
  import OrganizationReviewBanner from '~/components/Organizations/OrganizationReviewBanner.vue'
  import OrganizationVisibilityBanner from '~/components/Organizations/OrganizationVisibilityBanner.vue'

  export default {
    components: {
      HcTextcount,
      ContributionCard,
      'hc-follow-buttons': FollowButtons,
      OrganizationReviewBanner,
      OrganizationVisibilityBanner
    },
    data () {
      return {
        isLoading: true,
        loadingFinished: false,
        contributed: {total: 0, data: []},
        form: {
          coverImg: null,
          logo: null
        },
        uploadingCover: false,
        uploadingLogo: false
      }
    },
    async asyncData ({app, params, store, error}) {
      let organization
      if (!isEmpty(params) && !isEmpty(params.slug) && params.slug !== undefined) {
        organization = await app.$api.service('organizations').find({
          query: {
            slug: params.slug
          }
        })
      }
      if (!organization || isEmpty(organization.data)) {
        error({ statusCode: 404 })
      }
      return {
        params,
        organization: organization.data[0]
      }
    },
    async mounted () {
      const limit = 10

      let query = {
        organizationId: this.organization._id,
        $limit: limit,
        $sort: {
          createdAt: -1
        }
      }

      // show only public posts if its not your own profile
      if (!this.canEdit) {
        query.visibility = 'public'
          // query.categoryIds = { $exists: true, $not: {$size: 0} }
      }

      try {
        let res = await this.$api.service('contributions').find({query})
        this.contributed = res
        this.isLoading = false
        this.loadingFinished = true
      } catch (err) {
        // this just displays nothing
        // @todo implement some user feedback
        console.error(err)
        this.isLoading = false
        this.loadingFinished = true
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
      isOwner () {
        return this.user && this.user._id === this.organization.userId
      },
      followerCount () {
        return this.organization.followersCounts ? this.organization.followersCounts.users : 0
      },
      canEdit() {
        return this.isOwner || ['admin', 'moderator'].includes(this.user.role) !== false
      }
    },
    methods: {
      async followOrganization () {
        let currentUser = this.$store.getters['auth/user']
        let organizationId = this.organization._id
        // if (indexOf(this.organization.followerIds, currentUser._id) <= 0) {
        //   const res = await this.$store.dispatch('organizations/follow', {
        //     currentUserId: currentUser._id,
        //     organizationId: organizationId
        //   })
        //   console.log('#res', res)
        //   if (!isEmpty(res.id)) {
        //     this.$snackbar.open({
        //       message: this.$t('actions.follow', { name: this.organization.name }),
        //       type: 'is-success'
        //     })
        //   }
        // }
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
  @import "../../components/layout/timeline";

  $borderRadius: 0;

  .organization-profile {
    &.has-cover .organization-avatar {
      // transform: translateX(50%) translateY(-50%) !important;
    }

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
      width: 100%;
      height: 100%;
    }

    .organization-timeline {
      margin-top: 1rem;

      .timeline-content {
        padding-top: 0;
      }
    }


    .organization-sidebar-right {
      h3 {
        text-align: center;
      }
    }

    .edit-wrapper {
      position: absolute;
      top: 1rem;
      right: 1rem;

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

      & > .title {
        margin-bottom: -1rem;
      }

      /*.organization-actions {
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
      }*/

      .organization-avatar {
        border-radius: $borderRadius;
        width:         100%;
        height:        130px;
        border:        none;
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

            & img {
              background-color: #fff;
              object-fit:    contain;
            }
          }
        }
      }

      .organization-hc-box {
        position: relative;

        .organization-name {
          font-size: 16px;
          text-align: center;
          padding-top: 1.2rem;
        }

        .categories {
          text-align: center;
          padding-top: 1rem;
          margin-bottom: -0.5rem;
          justify-content: center;
        }
      }
    }
  }
</style>
