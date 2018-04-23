<template>
  <transition name="fade">
    <article class="message" v-if="showMessage">
      <div class="message-body">
        <div v-html="$t('component.organization.messageInvisible')"></div>
        <br />
        <div>
          <hc-button @click.prevent="openSettings">
            {{ $t('button.changeSettings') }}
          </hc-button>
        </div>
      </div>
    </article>
  </transition>
</template>

<script>
  export default {
    name: 'organization-visibility-banner',
    props: {
      organization: {
        type: Object,
        required: true
      },
      user: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        isEnabled: false
      }
    },
    methods: {
      async reviewOrganization () {
        const res = await this.$store.dispatch('organizations/patch', {
          _id: this.organization._id,
          isReviewed: true
        })
        // console.log(res)
        this.$emit('review', res)
        this.isEnabled = res.isEnabled
      },
      openSettings () {
        let id = this.organization._id
        this.$router.push({name: 'organizations-settings', query: {id}})
      }
    },
    computed: {
      showMessage () {
        return this.user && this.organization && !this.organization.isEnabled
      }
    }
  }
</script>

