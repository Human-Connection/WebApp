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
            <div class="column is-6">
              <div class="field">
                <div class="control">
                  <input :disabled="isLoading || !form.invites.userCanInvite" type="text" style="width: 50px; margin-top: -0.35rem; margin-right: 0.5rem;" id="form-max-invites-by-user" class="input is-small has-text-right" v-model="form.invites.maxInvitesByUser">
                  <label for="form-max-invites-by-user">{{ $t('component.admin.invitesByUserMaxCount', 'Max invites per user') }}</label>
                </div>
              </div>
            </div>
          </div>
          <no-ssr>
            <div class="field autowrap">
              <b-field :label="$t('auth.settings.invitesOnlyForUserWithBadges')">
                <b-taginput
                    ref="badgeInput"
                    :data="filteredTags"
                    :disabled="isLoading || !form.invites.userCanInvite"
                    field="label"
                    v-model="selectedBadges"
                    autocomplete
                    placeholder="add badge"
                    @add="add"
                    @remove="remove"
                    @keydown.tab.native="onTagTab"
                    @typing="getFilteredTags">
                  <template slot-scope="props">
                    <img
                      :src="props.option.image.path"
                      width="24"
                      :alt="$t(`component.badges.${props.option.image.alt}`)"
                      :title="$t(`component.badges.${props.option.key}`)">&nbsp;
                    <strong>{{ $t(`component.badges.${props.option.key}`)}}</strong>
                  </template>
                  <template slot="empty">
                    {{ $t('component.search.noMoreResults') }}
                  </template>
                </b-taginput>
              </b-field>
            </div>
          </no-ssr>
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
  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash'

  export default {
    middleware: 'admin',
    layout: 'admin',
    mixins: [animatable],
    head () {
      return {
        title: this.$t('component.admin.settings')
      }
    },
    async asyncData ({app, store}) {
      let settings = await store.getters['settings/get']
      const badges = await app.$api.service('badges').find({ query: { $limit: 100 }})
      return {
        badges: badges.data || [],
        form: JSON.parse(JSON.stringify(settings)) // remove reactivity
      }
    },
    mounted () {
      this.updateBadgeLables()
      this.$nextTick(this.updateSelectedBadesFromForm)
    },
    watch: {
      'userSettings.uiLanguage' () {
        this.updateBadgeLables()
        this.updateSelectedBadesFromForm()
      }
    },
    data () {
      return {
        seedingFakeData: false,
        seedingDemoData: false,
        showDangerZone: false,
        isLoading: false,
        filteredTags: [],
        badges: [],
        selectedBadges: []
      }
    },
    computed: {
      ...mapGetters({
        userSettings: 'auth/userSettings'
      })
    },
    methods: {
      add (badge) {
        this.updateBadeIdsInForm()
      },
      remove (badge) {
        this.updateBadeIdsInForm()
      },
      updateBadeIdsInForm () {
        this.form.invites.onlyUserWithBadgesCanInvite = []
        this.selectedBadges.forEach(badge => {
          this.form.invites.onlyUserWithBadgesCanInvite.push(badge._id)
        })
      },
      updateSelectedBadesFromForm () {
        this.selectedBadges = []
        this.badges.forEach(badge => {
          if (this.form.invites.onlyUserWithBadgesCanInvite.indexOf(badge._id) >= 0) {
            this.selectedBadges.push(badge)
          }
        })
      },
      updateBadgeLables () {
        this.badges.forEach(badge => {
          badge.label = this.$t(`component.badges.${badge.key}`)
        })
      },
      onTagTab (e) {
        if (e && !isEmpty(e.target.value)) {
          setTimeout(() => {
            e.target.focus()
          }, 20)
        }
      },
      getFilteredTags(text) {
        this.filteredTags = this.badges.filter(badge => {
          if (this.form.invites.onlyUserWithBadgesCanInvite.indexOf(badge._id) >= 0) {
            return false
          }
          let isIn = badge.key
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
          if (isIn) return true

          return badge.label
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        })
      },
      async saveSettings () {
        this.isLoading = true
        try {
          let res = await this.$store.dispatch('settings/patch', this.form)
          // remove reactivity
          res = JSON.parse(JSON.stringify(res))
          this.form = Object.assign(this.form, res)
          this.updateSelectedBadesFromForm()
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
