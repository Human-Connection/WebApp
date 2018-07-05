<template>
  <div class="languages fullwidth-box" :class="classes">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.invites', 'Invites') }}
      </h2>
      <p class="subtitle is-6">{{ $t('auth.settings.invitesDescription') }}</p>
    </div>
    <hr>
    <div>
      <h5  v-for="invite in invites.data" :key="invite._id"
          class="is-5 title invite-code"
          :class="{used: invite.wasUsed}"
          v-clipboard="() => copyInviteLink(invite)"
          v-clipboard:success="() => clipboardSuccess(invite)">
        {{ invite.code }}
      </h5>
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

  export default {
    mixins: [animatable],
    data() {
      return {
        isLoading: false,
        invites: []
      };
    },
    async mounted () {
      this.$nextTick(async () => {
        const res = await this.$api.service('user-invites').find()
        this.invites = res || { total: 0, data: [] }
      })
    },
    methods: {
      copyInviteLink (invite) {
        return `http://localhost:3000/auth/register?email=${invite.email}&code=${invite.code}&invitedByUserId=${invite.invitedByUserId}`
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
          this.invites = await this.$api.service('user-invites').find()

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

  .invite-code {
    padding: 5px;
    cursor: pointer;
    width: 120px;
    text-align: center;
    display: inline-block;
    // float: left;

    color: #333;
    border: 1px solid #aaa;
    border-radius: 3px;
    margin-bottom: 5px;
    margin-right: 5px;

    &.used {
      text-decoration: line-through;
      pointer-events: none;
      opacity: .5;
    }
  }
</style>
