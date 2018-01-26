<template>
  <section class="container organization-profile" style="position: relative">
    <hc-upload class="profile-header card"
               :preview-image="coverImg"
               :test="true"
               @update="onCoverUploadCompleted"
               @start-sending="uploadingCover = true"
               @stop-sending="uploadingCover = false" >
    </hc-upload>
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
    asyncData ({params}) {
      return {
        params: params
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated'
      }),
      async coverImg () {
        let orga = await this.organization
        if (!isEmpty(this.form.coverImg)) {
          return this.form.coverImg
        } else if (!isEmpty(orga.data[0])) {
          return orga.data[0].coverImg
        } else {
          return 'https://source.unsplash.com/random/1250x280'
        }
      },
      organization () {
        if (!isEmpty(this.params) && !isEmpty(this.params.slug) && this.params.slug !== undefined) {
          return feathers.service('organizations').find({
            query: {
              slug: this.params.slug
            }
          })
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
</style>
