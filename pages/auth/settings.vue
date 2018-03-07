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
            <li @click.prevent="changeMenu('dashboard')" v-bind:class="{ 'is-active': currentMenu === 'dashboard'}"><a>{{ $t('auth.settings.dashboard', 'Dashboard') }}</a></li>
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
                  Willkommen in deinem Profil
                </h3>
                <p>Hier kannst Du deine Daten verwalten. Um etwas zu bearbeiten klicke einfach auf den Text oder das <i class="fa fa-pencil"></i> icon. <br />
                  Bitte gib an niemanden dein Passwort weiter. Damit Du geschützt bist empfehlen wir Dir ein Passwort mit mindestens 16 Zeichen zu verwenden.</p>
              </div>
              <div class="editable-details">
                <div class="columns">
                  <div class="column is-four-fifths">
                    <p>
                      <strong>{{ $t('auth.settings.yourName', 'Your Name:') }} </strong>
                      <span>
                      <hc-textedit @change="updateUser" :type="'input'" :value="data.name || ''"></hc-textedit>
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
              asdf
            </div>
            <div class="languages fullwidth-box" v-if="currentMenu === 'languages'">
              <div class="info-text">
                <h3 class="title is-4">
                  Spracheinstellungen
                </h3>
                <p>Hier kannst Du wählen in welcher Sprache die Webseite und Beiträge angezeigt werden.</p>
              </div>
              <div class="language-wrapper">
                <b-field label="Select your languages">
                  <b-taginput
                          v-model="data.selectedLanguages"
                          :data="data.languageOptions"
                          autocomplete
                          :allowNew="false"
                          icon="label"
                          placeholder="Select your languages">
                  </b-taginput>
                </b-field>
                <b-field label="Select your Interface language">
                  <b-taginput
                          v-model="data.selectedInterfaceLanguage"
                          :data="data.languageOptions"
                          autocomplete
                          maxtags="1"
                          :allowNew="false"
                          icon="label"
                          placeholder="Select your language">
                  </b-taginput>
                </b-field>
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
        data: {
          name: '',
          selectedLanguages: [],
          languageOptions: ['German', 'English'],
          selectedInterfaceLanguage: []
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
        this.usersettings.contributionLanguage = this.data.selectedLanguages
        this.usersettings.uiLanguage = this.data.selectedInterfaceLanguage[0]
        this.$store.dispatch('usersettings/patch', this.usersettings)
          .then(() => {
            this.isLoading = false
            this.disabled = false
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
        this.data.name = user.name
      }
    },
    mounted () {
      this.data.name = this.user.name
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
  }

</style>
