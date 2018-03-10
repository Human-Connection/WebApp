<template>
  <section class="container account-settings" style="position: relative">
    <div class="columns">
      <div class="column is-one-third">
        <aside class="menu">
          <p class="menu-label">
            <i class="fa fa-info"></i> {{ $t('auth.settings.general', 'General') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="changeMenu('general')" v-bind:class="{ 'is-active': currentMenu === 'general'}"><a>{{ $t('auth.settings.data', 'Your Data') }}</a></li>
          </ul>
          <p class="menu-label">
            <i class="fa fa-shield"></i> {{ $t('auth.settings.security', 'Security') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="changeMenu('access')" v-bind:class="{ 'is-active': currentMenu === 'access'}"><a>{{ $t('auth.settings.access', 'Access') }}</a></li>
          </ul>
          <p class="menu-label">
            <i class="fa fa-university"></i> {{ $t('auth.settings.organizations', 'Organizations') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="changeMenu('organizations')" v-bind:class="{ 'is-active': currentMenu === 'organizations'}"><a>{{ $t('auth.settings.myOrganizations', 'My Organizations') }}</a></li>
          </ul>
          <p class="menu-label">
            <i class="fa fa-cogs"></i> {{ $t('auth.settings.networkSettings', 'Network settings') }}
          </p>
          <ul class="menu-list">
            <li @click.prevent="changeMenu('languages')" v-bind:class="{ 'is-active': currentMenu === 'languages'}"><a>{{ $t('auth.settings.languages', 'Languages') }}</a></li>
          </ul>
        </aside>
      </div>
      <div class="column is-two-thirds">
        <hc-box class="settings-content">
          <div class="settingswrapper">
            <div class="user-data fullwidth-box" v-if="currentMenu === 'general'">
              <div class="info-text">
                <h3 class="title is-4">
                  {{ $t('auth.settings.profileWelcome') }}
                </h3>
                <p>{{ $t('auth.settings.profileWelcomeText') }}</p>
              </div>
              <div class="editable-details">
                <div class="columns">
                  <div class="column is-four-fifths">
                    <p>
                      <strong>{{ $t('auth.settings.yourName', 'Your Name:') }} </strong>
                      <span>
                      <hc-textedit @change="updateUser" :type="'input'" :value="form.name || ''"></hc-textedit>
                    </span>
                    </p>
                  </div>
                  <div class="column is-one-fifth">
                    <i class="fa fa-pencil"></i>
                  </div>
                </div>
              </div>
              <p class="under-construction"><strong><h3>UNDER CONSTRUCTION</h3></strong></p>
            </div>
            <div class="security fullwidth-box" v-if="currentMenu === 'access'">
              <div class="info-text">
                <h3 class="title is-4">
                  {{ $t('auth.settings.securityWelcome') }}
                </h3>
                <p>{{ $t('auth.settings.securityWelcomeText') }}</p>
              </div>
              <div class="columns">
                <div class="column is-one-third">
                  <div class="field">
                    <label class="label">{{ $t('auth.settings.currentPassword') }}</label>
                    <p class="control">
                      <input v-model="form.currentPassword" type="password" class="input">
                    </p>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-third">
                  <div class="field">
                    <label class="label">{{ $t('auth.settings.newPassword') }}</label>
                    <p class="control">
                      <input v-model="form.newPassword" type="password" class="input">
                    </p>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-third">
                  <div class="field">
                    <label class="label">{{ $t('auth.settings.newPasswordConfirm') }}</label>
                    <p class="control">
                      <input v-model="form.newPasswordConfirm" type="password" class="input">
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="has-text-right">
              <hc-button :isLoading="isLoading"
                         :disabled="disabled"
                         @click.prevent="savePassword">
                <i class="fa fa-check"></i>
                &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
              </hc-button>
            </div>
            <div class="languages fullwidth-box" v-if="currentMenu === 'languages'">
              <div class="info-text">
                <h3 class="title is-4">
                  {{ $t('auth.settings.languageSettings') }}
                </h3>
                <p>{{ $t('auth.settings.languageSettingsText') }}</p>
              </div>
              <div class="language-wrapper">
                <b-field label="Select your contribution languages">
                  <b-taginput
                          v-model="usersettings.contributionLanguages"
                          :data="form.languageOptions"
                          autocomplete
                          :allowNew="false"
                          icon="label"
                          placeholder="Select your languages">
                  </b-taginput>
                </b-field>
                <div class="field">
                  <div class="control has-icons-left">
                    <div class="select">
                      <label><strong>{{ $t('auth.settings.interfaceLanguageLabel') }}</strong></label>
                      <select v-model="usersettings.uiLanguage">
                        <option value="de" selected>Deutsch</option>
                        <option value="en">English</option>
                      </select>
                      <div class="icon is-small is-left">
                        <i class="fa fa-globe"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="has-text-right">
                <hc-button :isLoading="isLoading"
                           :disabled="disabled"
                           @click.prevent="saveSettings">
                  <i class="fa fa-check"></i>
                  &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
                </hc-button>
              </div>
            </div>
          </div>
        </hc-box>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import feathers from '~/plugins/feathers'

  export default {
    components: {
    },
    data () {
      return {
        currentMenu: 'general',
        form: {
          name: '',
          languageOptions: ['German', 'English'],
          currentPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        },
        errors: null,
        isLoading: false,
        disabled: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    async asyncData ({params, store}) {
      let user, usersettings
      user = store.getters['auth/user']
      usersettings = await feathers.service('usersettings').find({
        query: {
          userId: user._id
        }
      })

      return {
        params: params,
        usersettings: usersettings.data[0]
      }
    },
    middleware: ['authenticated'],
    methods: {
      async saveSettings () {
        this.isLoading = true
        this.disabled = true
        this.$store.dispatch('usersettings/patch', this.usersettings)
          .then(() => {
            this.isLoading = false
            this.disabled = false
            this.$snackbar.open({
              message: this.$t('auth.settings.saveSettings'),
              duration: 4000,
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            this.errors = true
            this.isLoading = false
          })
      },
      async savePassword () {
        this.isLoading = true
        this.disabled = true
        let user
        user = this.$store.getters['auth/user']
        console.log(this.form)
        console.log(user)
      },
      changeMenu (newMenu) {
        this.currentMenu = newMenu
      },
      async updateUser (val) {
        if (val !== undefined && val !== '') {
          this.data.name = val
          this.$store.dispatch('auth/patch', this.data)
            .then(() => {
              this.isLoading = false
            })
            .catch(error => {
              this.$toast.open({
                message: error.message,
                duration: 3000,
                type: 'is-danger'
              })
              this.errors = true
              this.isLoading = false
            })
        }
      }
    },
    watch: {
      user (user) {
        this.form.name = user.name
      }
    },
    mounted () {
      this.form.name = this.user.name
    },
    head () {
      return {
        title: this.$t('auth.account.settings', 'Settings')
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";
  .account-settings {
    .is-active {
      background: #fefefe;
    }
    .info-text {
      margin-bottom: 25px;
    }
    .editable-details {
      margin-bottom: 25px;
    }
    .control {
      .help.counter {
        float: none;
      }
    }
    .language-wrapper {
      .icon {
        margin-top: 21px;
      }
    }
  }
</style>