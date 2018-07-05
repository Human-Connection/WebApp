<template>
  <div class="languages fullwidth-box" :class="classes">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.invites', 'Invites') }}
      </h2>
      <p class="subtitle is-6">{{ $t('auth.settings.invitesDescription') }}</p>
    </div>
    <div class="ticket-wrapper">
      <div class="columns is-multiline">
        <invite-ticket v-for="invite in invites.data" :key="invite._id"
                      :code="invite.code"
                      :used="invite.wasUsed"
                      v-clipboard="() => copyInviteLink(invite)"
                      v-clipboard:success="() => clipboardSuccess(invite)" />
      </div>
    </div>
    <footer class="card-footer">
      <hc-button :isLoading="isLoading"
                  :disabled="isLoading || !hasInvitesLeft"
                  @click.prevent="save">
        <hc-icon icon="magic" class="icon-left" /> {{ $t('auth.settings.invitesGenerateButton', 'Generate invite codes', {}, settings.invites.maxInvitesByUser) }}
      </hc-button>
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import animatable from '~/components/mixins/animatable'
  import InviteTicket from '~/components/Auth/InviteTicket'
  import urlHelper from '~/helpers/urls'

  export default {
    mixins: [animatable],
    components: {
      'invite-ticket': InviteTicket
    },
    data() {
      return {
        isLoading: false,
        invites: { total: 0, data: [] },
        fetchTimer: null
      };
    },
    async mounted () {
      this.$nextTick(async () => {
        await this.fetch()
      })
    },
    beforeDestroy () {
      clearTimeout(this.fetchTimer);
    },
    methods: {
      async fetch () {
        clearTimeout(this.fetchTimer);
        const res = await this.$api.service('user-invites').find()
        this.invites = res || { total: 0, data: [] }
        this.fetchTimer = setTimeout(this.fetch, 10000)
      },
      copyInviteLink (invite) {
        const endpoint = urlHelper.buildEndpointURL(this.$env.WEBAPP_HOST, { port: this.$env.WEBAPP_PORT });
        return `${endpoint}/auth/register?email=${invite.email}&code=${invite.code}&invitedByUserId=${invite.invitedByUserId}`
      },
      clipboardSuccess (invite) {
        this.$snackbar.open({
          message: this.$t('auth.settings.invitesCopiedToClipboard', { code: invite.code }),
          type: "is-success"
        });
      },
      async save() {
        this.isLoading = true;
        try {
          await this.$api.service('user-invites').create({})
          await this.fetch()

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });
        } catch (err) {
          this.animate('shake')
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isLoading = false;
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user",
        settings: 'settings/get'
      }),
      hasInvitesLeft () {
        return this.settings.invites.userCanInvite &&  this.invites.total < this.settings.invites.maxInvitesByUser
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "assets/styles/_animations";

  .ticket-wrapper {
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    margin-bottom: -2rem;
    padding: 1.5rem;
    background-color: #eee;
  }
</style>
