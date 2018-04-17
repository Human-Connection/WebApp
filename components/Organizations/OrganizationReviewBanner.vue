<template>
  <transition name="fade">
    <article class="message" v-if="isReady && !isReviewed">
      <template v-if="!isMod || disableReview">
        <div class="message-body"
            v-html="$t('component.organization.messageInReview', {email: 'support@human-connection.org'})"></div>
      </template>
      <template v-else>
        <div class="message-body">
          <div v-html="$t('component.organization.messageInReviewMod', {email: 'support@human-connection.org'})"></div>
          <br />
          <div class="has-text-right">
            <hc-button size="small" @click="reviewOrganization">
              <hc-icon class="icon-left" icon="check" /> {{ $t('button.review') }}
            </hc-button>
          </div>
        </div>
      </template>
    </article>
  </transition>
</template>

<script>
  export default {
    name: 'organization-review-banner',
    props: {
      organization: {
        type: Object,
        required: true
      },
      user: {
        type: Object,
        required: true
      },
      disableReview: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        reviewed: false
      }
    },
    methods: {
      async reviewOrganization () {
        const res = await this.$store.dispatch('organizations/patch', {
          _id: this.organization._id,
          isReviewed: true
        })
        console.log(res)
        this.$emit('review', res)
        this.reviewed = res.isReviewed
      }
    },
    computed: {
      isReady () {
        return this.user && this.organization
      },
      isReviewed () {
        return this.organization.isReviewed || this.reviewed
      },
      isMod () {
        return this.user && ['admin', 'moderator'].includes(this.user.role)
      }
    }
  }
</script>

