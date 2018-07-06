<template>
  <div :class="classes">
    <h3 class="title is-3">{{ $t('component.admin.settings', 'Settings') }}</h3>
    <transition name="slide-up">
      <div v-if="!showDangerZone" key="settings">
        <section>
          <hr>
          <h4 class="is-5 title">Invites</h4>
          <div class="columns">
            <div class="column">
              <b-switch v-model="form.invites.userCanInvite">{{ $t('component.admin.invitesByUserToggle', 'Allow users to invite others') }}</b-switch>
            </div>
            <div class="column is-5">
              <div class="field">
                <div class="control">
                  <input :disabled="!form.invites.userCanInvite" type="text" style="width: 50px; margin-top: -0.35rem; margin-right: 0.5rem;" id="form-max-invites-by-user" class="input is-small has-text-right" v-model="form.invites.maxInvitesByUser">
                  <label for="form-max-invites-by-user">{{ $t('component.admin.invitesByUserMaxCount', 'Max invites per user') }}</label>
                </div>
              </div>
            </div>
          </div>
        </section>
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
                    @click.prevent="saveSettings"
                    :isLoading="isLoading || seedingFakeData || seedingDemoData"
                    :disabled="isLoading || showDangerZone || seedingFakeData || seedingDemoData"
                  >
              <hc-icon icon="check" class="icon-left" /> {{ $t('button.save') }}
          </hc-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import animatable from '~/components/mixins/animatable'

  export default {
    middleware: 'admin',
    layout: 'admin',
    mixins: [animatable],
    head () {
      return {
        title: this.$t('component.admin.settings')
      }
    },
    async asyncData ({store}) {
      let settings = await store.getters['settings/get']
      return {
        form: JSON.parse(JSON.stringify(settings)) // remove reactivity
      }
    },
    data () {
      return {
        seedingFakeData: false,
        seedingDemoData: false,
        showDangerZone: false,
        isLoading: false
      }
    },
    methods: {
      async saveSettings () {
        this.isLoading = true
        try {
          let res = await this.$store.dispatch('settings/patch', this.form)
          // remove reactivity
          res = JSON.parse(JSON.stringify(res))
          this.form = Object.assign(this.form, res)
          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: 'is-success'
          })
        } catch (err) {
          this.animate('shake')
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        }
        this.isLoading = false
      },
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
  @import "assets/styles/_animations";
  @import "assets/styles/settings/footer";

  .message-body {
    .field {
      padding-top: 1rem;
    }
  }
</style>
