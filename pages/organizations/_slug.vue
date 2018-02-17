<template>
  <section class="container organization-profile" style="position: relative">

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
          logo: null
        },
        showOrganizationForm: false,
        uploadingCover: false,
        uploadingLogo: false
      }
    },
    middleware: ['authenticated'],
    async asyncData ({params, store, redirect}) {
      let organization, owner, isOwner
      if (!isEmpty(params) && !isEmpty(params.slug) && params.slug !== undefined) {
        organization = await feathers.service('organizations').find({
          query: {
            slug: params.slug
          }
        })
      }
      if (organization === undefined || isEmpty(organization.data)) {
        // TODO: show organization create form ask name first
        return redirect('/organizations/name')
      } else {
        // is owner?
        owner = store.getters['auth/user']
        isOwner = owner !== null && owner._id === organization.data[0].userId
      }
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
