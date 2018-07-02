<template>
  <section>
    <h3 class="title is-3">{{ $t('component.admin.settings', 'Settings') }}</h3>
    <!--<hr>
    <h4 class="title is-5">{{ $t('component.admin.userInvitesHeading', 'User Invites') }}</h4>-->
    <!--<b-switch v-model="showDangerZone">{{ $t('component.admin.userInvitesToggle', 'Allow users to invite other users by email') }}</b-switch>-->
    <!--<hr>
    <b-switch v-model="showDangerZone">
      {{ $t('component.admin.developmentLabel', 'Enable the danger zone') }}<hc-icon icon="warning" class="icon-right" />
    </b-switch>-->
    <transition name="slide-up">
      <div v-if="!showDangerZone" key="settings">
        <b-switch v-model="form.allowUserInvites">{{ $t('component.admin.userInvitesToggle', 'Allow users to invite others by email') }}</b-switch>
      </div>
      <div v-else key="seeder">
        <hr>
        <!--<h4 class="title is-5">{{ $t('component.admin.development', 'Development') }}</h4>-->
        <div class="message is-danger">
          <div class="message-body">
            <hc-icon icon="warning" class="icon-left" /> <strong>{{ $t('component.admin.developmentWarning') }}</strong>
            <div class="field is-grouped">
              <div class="control">
                <hc-button color="danger"
                          @click="seedFakeData()"
                          :isLoading="seedingFakeData"
                          :disabled="seedingFakeData || seedingDemoData">
                  <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>{{ $t('component.admin.seedFakeData', 'Seed fake data') }}</strong>
                </hc-button>
              </div>
              <div class="control">
                <hc-button color="danger"
                          @click="seedDemoData()"
                          :isLoading="seedingDemoData"
                          :disabled="seedingFakeData || seedingDemoData">
                  <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>{{ $t('component.admin.seedDemoContributions', 'Seed demo contributions') }}</strong>
                </hc-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <footer class="card-footer">
      <div class="columns is-mobile">
        <div class="column">
          <b-switch type="is-danger" v-model="showDangerZone"><small>{{ $t('component.admin.development', 'Development') }}</small></b-switch>
        </div>
        <div class="column">
          <hc-button color="primary"
                    :isLoading="isLoading || seedingFakeData || seedingDemoData"
                    :disabled="isLoading || showDangerZone || seedingFakeData || seedingDemoData"
                  >
              <hc-icon icon="check" class="icon-left" /> {{ $t('button.save') }}
          </hc-button>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: this.$t('component.admin.settings')
      }
    },
    data () {
      return {
        seedingFakeData: false,
        seedingDemoData: false,
        showDangerZone: false,
        isLoading: false,
        form: {
          allowUserInvites: false
        }
      }
    },
    methods: {
      seedFakeData () {
        this.$api.service('admin').timeout = 120 * 1000 // 2 minute timeout
        this.seedingFakeData = true
        this.$api.service('admin').create({ seedFakeData: true }).then(res => {
          this.seedingFakeData = false
          this.$snackbar.open({
            message: this.$t('component.admin.seedFakeDataSuccessMessage', 'Created a ton of new entries, have fun!'),
            duration: 4000,
            type: 'is-success'
          })
        }).catch(err => {
          console.error(err)
          this.seedingFakeData = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        })
      },
      seedDemoData () {
        this.$api.service('admin').timeout = 120 * 1000 // 2 minute timeout
        this.seedingDemoData = true
        this.$api.service('admin').create({ seedDemoData: true }).then(res => {
          this.seedingDemoData = false
          this.$snackbar.open({
            message: this.$t('component.admin.seedDemoContributionsSuccessMessage', 'Added the demo entries to the database!'),
            duration: 4000,
            type: 'is-success'
          })
        }).catch(err => {
          console.error(err)
          this.seedingDemoData = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/settings/footer";

  .message-body {
    .field {
      padding-top: 1rem;
    }
  }
</style>
