<template>
  <section style="position: relative;">
    <h3 class="title is-3">{{ $t('component.admin.manageUsers', 'Manage Users') }}</h3>
    <b-tabs class="user-tabs" position="is-right" v-model="activeTab">
      <b-tab-item label="Users" icon="users">
        <search-input id="user-search"
                      :value="userSearchValue"
                      @search="userSearchOnInput" />
        <article class="message is-info invite-code" v-if="inviteCodeForEmail">
          <div class="message-body content">
            <div>
              Unused invite code found for user:<br/>
              <strong class="code">{{ inviteCodeForEmail.code }}</strong>
              <div class="code-button" >
                <a
                  v-clipboard:copy="inviteLink"
                  v-clipboard:success="clipboardSuccess"
                  class="confirm-info button is-small is-info notifications">Copy Invite Code</a>
              </div>
            </div>
          </div>
        </article>
        <no-ssr>
          <v2-table :data="users.data"
                    :stripe="true"
                    :loading="usersLoading"
                    :total="users.total"
                    :shown-pagination="userTotalPages > 1"
                    :pagination-info="paginationInfo"
                    @page-change="handleUserPageChange">
            <v2-table-column label="Name" prop="name" align="left" width="200">
              <template slot-scope="row">
                <a :title="row.name" v-if="row.slug" :href="`/profile/${row.slug}`" target="_blank" style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
                  <hc-avatar :showOnlineStatus="true" :user="row" style="display: inline-block; float: left;" />&nbsp;<span style="display: inline-block; padding: 5px 10px;">{{ row.name }}</span>
                </a>
                <div :title="row.name" v-else style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
                  <hc-avatar :showOnlineStatus="true" :user="row" style="display: inline-block; float: left;" />&nbsp;<span style="display: inline-block; padding: 5px 10px;">{{ row.name }}</span>
                </div>
              </template>
            </v2-table-column>
            <v2-table-column label="Verified" prop="isVerified" align="center" width="50">
              <template slot-scope="row">
                <i v-show="row.isVerified" class="fa fa-check"></i>
              </template>
            </v2-table-column>
            <v2-table-column label="Legal" prop="termsAndConditionsAccepted" align="center" width="50">
              <template slot-scope="row">
                <i v-show="row.termsAndConditionsAccepted" :title="row.termsAndConditionsAccepted" class="fa fa-check"></i>
              </template>
            </v2-table-column>
            <v2-table-column label="Last Active" prop="lastActiveAt" align="left">
              <template slot-scope="row">
                <hc-relative-date-time :dateTime="row.lastActiveAt" v-if="row.lastActiveAt" />
                <span v-else>-</span>
              </template>
            </v2-table-column>
            <v2-table-column label="" prop="userSettings.uiLanguage" align="center" width="32">
              <template slot-scope="row">
                <template v-if="row.userSettings">
                  <img width="16" :src="`/assets/svg/flags/${row.userSettings.uiLanguage}.svg`" />
                </template>
                <template v-else>
                  -
                </template>
              </template>
            </v2-table-column>
            <v2-table-column label="" prop="badges" align="left">
              <template slot-scope="row">
                <span
                  v-if="row.badgeIds.length"
                  v-for="badgeId in row.badgeIds"
                  :key="badgeId">
                  <img
                    v-if="badgesByKeyOrId[badgeId]"
                    width="24"
                    :title="$t(`component.badges.${badgesByKeyOrId[badgeId].key}`)"
                    :src="badgesByKeyOrId[badgeId].image.path" />
                </span>
              </template>
            </v2-table-column>
            <v2-table-column label="Role" prop="role" align="left" width="70"></v2-table-column>
          </v2-table>
        </no-ssr>
      </b-tab-item>
      <b-tab-item label="Invite Codes" icon="ticket">
        <div class="info-text">
          <p class="subtitle is-6">
            <i class="fa fa-info-circle"></i> Here you can invite users by providing a a csv file with at least the email and the language (de/en) of the users to invite.
          </p>
        </div>
        <br>
        <div class="field">
          <div class="control has-text-centered">
            <br />
            <div class="file is-primary">
              <label class="file-label">
                <input class="file-input"
                       type="file"
                       name="resume"
                       @change="addedFile"
                       accept=".csv">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fa fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a csv file…
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <no-ssr>
          <v2-table id="invite-table"
                    :data="invitePaginated"
                    :stripe="true"
                    :loading="invitesLoading"
                    :total="invitePreview.length"
                    :shown-pagination="currentPage > 1 || invitesTotalPages > 1"
                    :pagination-info="paginationInfo"
                    @page-change="handleInvitesPageChange">
            <v2-table-column label="Email" prop="email" align="left" width="200">
              <template slot-scope="row">
                <span :title="row.email">{{ row.email }}</span>
              </template>
            </v2-table-column>
            <v2-table-column label="Code" prop="code" align="left">
              <template slot-scope="row">
                <a :href="`${baseURL}/auth/register?email=${row.email}&code=${row.code}&lang=${row.language}`">{{ row.code }}</a>
              </template>
            </v2-table-column>
            <v2-table-column label="" prop="language" align="center" width="32">
              <template slot-scope="row">
                <img width="16" :src="`/assets/svg/flags/${row.language}.svg`" />
              </template>
            </v2-table-column>
            <v2-table-column label="" prop="badges" align="left">
              <template slot-scope="row">
                <span
                  v-if="row.badges.length"
                  v-for="badgeId in row.badges"
                  :key="`${row.email}|${badgeId}`">
                  <img
                    v-if="badgesByKeyOrId[badgeId]"
                    width="24"
                    :title="$t(`component.badges.${badgesByKeyOrId[badgeId].key}`)"
                    :src="badgesByKeyOrId[badgeId].image.path" />
                </span>
              </template>
            </v2-table-column>
            <v2-table-column label="Role" prop="role" align="left" width="50"></v2-table-column>
            <v2-table-column label="Created" prop="created" align="center">
              <template slot-scope="row">
                <i v-show="row.created === true" class="fa fa-check"></i>
                <i v-show="row.created === false" class="fa fa-ban"></i>
              </template>
            </v2-table-column>
            <v2-table-column label="Updated" prop="updated" align="center">
              <template slot-scope="row">
                <i v-show="row.wasUpdated === true" class="fa fa-check"></i>
                <i v-show="row.wasUpdated === false" class="fa fa-ban"></i>
              </template>
            </v2-table-column>
          </v2-table>
        </no-ssr>
        <br />
        <div class="field">
          <b-checkbox v-model="form.sendInviteEmails" style="item-align: center" :disabled="isLoading || invitesLoading">Send invite mails</b-checkbox>
        </div>
        <footer class="card-footer">
          <div class="field is-grouped">
            <div class="control">
              <hc-button color="danger"
                       @click="inviteUsers()"
                       :isLoading="isLoading || invitesLoading"
                       :disabled="isLoading || !invitePreview.length || !!resultDownloadURL">
                <hc-icon set="fa" icon="bolt"></hc-icon> &nbsp;<strong>Invite {{ invitePreview.length || 0 }} users
                <span style="font-weight: normal" v-if="form.sendInviteEmails">(with mailing)</span>
                <span style="font-weight: normal" v-else>(no mailing)</span></strong>
              </hc-button>
            </div>
            <div class="control">
              <a :href="resultDownloadURL"
                class="button pull-right"
                :class="{ 'is-loading': isLoading }"
                :disabled="isLoading || !results || !resultDownloadURL"
                download="data.csv">
                <hc-icon set="fa" icon="download"></hc-icon> &nbsp;<strong>{{ $t('component.admin.buttonDownloadCSV', 'Download CSV') }}</strong>
              </a>
            </div>
          </div>
        </footer>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
  import moment from 'moment'
  import parse from 'csv-parse/lib/sync'
  import { isEmpty, each, map, keyBy, castArray } from 'lodash'
  import SearchInput from '~/components/Search/SearchInput.vue'

  let itemLimit = 10

  export default {
    middleware: 'admin',
    layout: 'admin',
    components: {
      SearchInput
    },
    data () {
      return {
        form: {
          codes: '',
          sendInviteEmails: true
        },
        itemLimit: itemLimit,
        isLoading: false,
        usersLoading: true,
        invitesLoading: false,
        results: '',
        resultDownloadURL: null,
        users: [],
        userSearchValue: '',
        invitePreview: [],
        invitePaginated: [],
        inviteResults: [],
        inviteCodeForEmail: null,
        currentPage: 1,
        paginationInfo: {
          text: '', // this.paginationText,
          nextPageText: '>',
          prevPageText: '<'
        },
        activeTab: null
      }
    },
    async asyncData ({app}) {
      const limit = itemLimit

      const badges = await app.$api.service('badges').find({
        query: {
          $limit: 1000
        }
      })

      const users = await app.$api.service('users').find({
        query: {
          $limit: limit
        }
      })
      return {
        users: users,
        usersLoading: false,
        itemLimit: limit,
        badgesByKeyOrId: Object.assign({}, keyBy(badges.data, '_id'), keyBy(badges.data, 'key'))
      }
    },
    filters: {
      formatDate (val) {
        return moment(val).format('d.m.Y')
      }
    },
    computed: {
      baseURL () {
        return location.origin
      },
      userTotalPages () {
        return this.users.total / this.itemLimit
      },
      invitesTotalPages () {
        return this.invitePaginated.length / this.itemLimit
      },
      paginationText () {
        return `<span>Total of <strong>${this.user ? this.user.total : 0}</strong>, <strong>${this.itemLimit}</strong> per page</span>`
      },
      searchingForUserByEmail () {
        return !isEmpty(this.userSearchValue) && this.userSearchValue.indexOf('@') > 0
      },
      inviteLink (e) {
        let link = `${location.origin}/auth/register?email=${this.inviteCodeForEmail.email}&code=${this.inviteCodeForEmail.code}`
        return link
      }
    },
    methods: {
      clipboardSuccess () {
        this.$snackbar.open({
          message: this.$t('auth.settings.invitesCopiedToClipboard', { code: this.inviteCodeForEmail.code }),
          type: "is-success"
        });
      },
      userSearchOnInput (value) {
        this.userSearchValue = value
        this.handleUserPageChange(1)
      },
      /**
       * read the selected csv and
       */
      addedFile (e) {
        this.invitePreview = []
        this.invitePaginated = []
        this.results = ''
        this.resultDownloadURL = null
        this.invitesLoading = true
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return null
        }

        each(files, file => {
          if (!file.name.endsWith('.csv')) {
            this.$snackbar.open({
              message: this.$t('component.admin.messageCSVInvalid', `You have to select a valid .csv`),
              type: 'is-danger'
            })
            this.invitesLoading = false
            return null
          }
          var reader = new FileReader()
          reader.onload = event => {
            try {
              const data = event.target.result
                .replace(`"lang"`, `"language"`)
                .replace(`"rCode"`, `"code"`)

              const semicolonIndex = data.indexOf(';')
              const delimiter = (semicolonIndex >= 0 && semicolonIndex <= 200) ? `;` : `,`
              const csv = parse(data, {
                columns: true,
                delimiter: delimiter,
                trim: true
              })
              if (isEmpty(csv[0].email) || isEmpty(csv[0].language)) {
                throw new Error('You need a header with at least email and language in your csv!')
              }
              this.invitePreview = map(csv, (item) => {
                if (!isEmpty(item.badges)) {
                  // split values by pipe and cast them as an array
                  item.badges = castArray(item.badges.split('|'))
                }
                if (!isEmpty(item.email)) {
                  item.email = item.email.trim().toLowerCase()
                  return item
                }
              })
              this.handleInvitesPageChange(1)
            } catch (err) {
              this.$snackbar.open({
                message: `ERROR: ${err.message}`,
                type: 'is-danger'
              })
              this.invitesLoading = false
              this.invitePreview = []
              this.invitePaginated = []
            }
          }
          reader.readAsText(file)
        })
      },
      inviteUsers () {
        const sendInviteEmails = this.form.sendInviteEmails === true

        const data = map(this.invitePreview, item => Object.assign({}, item))

        this.invitesLoading = true
        this.$api.service('admin').timeout = 240000 // 4 minutes timeout
        this.$api.service('admin').create({ createInvites: data, sendInviteEmails }).then(res => {
          this.$snackbar.open({
            message: this.$t('component.admin.messageInvitesGenerated', {
              countCreated: res.length,
              countRequested: this.invitePreview.length
            }),
            type: 'is-success'
          })
          if (res && res.length) {
            this.results = `email,role,language,code,link\n`
          }
          res.forEach(item => {
            this.results += `${item.email},${item.role},${item.language},${item.code},${location.origin}/auth/register?email=${item.email}&code=${item.code}&lang=${item.language}\n`
          })

          // updated items
          const resByEmail = keyBy(res, 'email')
          this.invitePreview.forEach((item, key) => {
            const created = !isEmpty(resByEmail[item.email])
            this.$set(this.invitePreview[key], 'created', created)
            if (created) {
              this.$set(this.invitePreview[key], 'role', resByEmail[item.email].role)
              this.$set(this.invitePreview[key], 'code', resByEmail[item.email].code)
              this.$set(this.invitePreview[key], 'wasUpdated', resByEmail[item.email].wasUpdated)
              this.$set(this.invitePreview[key], 'created', !resByEmail[item.email].wasUpdated)
            }
          })
          const blob = new Blob(['\ufeff', this.results])
          this.resultDownloadURL = URL.createObjectURL(blob)

          this.invitesLoading = false
          this.isLoading = false
        }).catch(err => {
          this.isLoading = false
          this.invitesLoading = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        })
      },
      async handleUserPageChange (page) {
        this.currentPage = page
        this.usersLoading = true
        const start = (page - 1) * this.itemLimit

        const query = {
          $limit: this.itemLimit,
          $skip: start
        }
        if (this.searchingForUserByEmail) {
          query.email = this.userSearchValue.toLowerCase()
        } else if (!isEmpty(this.userSearchValue)) {
          query.name = {
            $search: this.userSearchValue
          }
        }

        this.users = await this.$api.service('users').find({query})

        if (this.searchingForUserByEmail && !this.users.total) {
          this.inviteCodeForEmail = await this.$api.service('invites').find({
            query: {
              email: this.userSearchValue.toLowerCase(),
              invitedByUserId: { $exists: false },
              wasUsed: { $ne: true }
            }
          })
          this.inviteCodeForEmail = this.inviteCodeForEmail.total ? this.inviteCodeForEmail.data[0] : null
        } else {
          this.inviteCodeForEmail = null
        }

        this.usersLoading = false
      },
      async handleInvitesPageChange (page) {
        this.currentPage = page
        this.invitesLoading = true
        const start = (page - 1) * this.itemLimit + 1
        this.invitesLoading = false

        this.invitePaginated = this.invitePreview.slice(start - 1, start + this.itemLimit)
      }
    },
    head () {
      return {
        title: 'Benutzer verwalten'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .cell-name {
    font-weight: bold;
  }

  a[disabled] {
    pointer-events: none;
  }

  .link {
    white-space: nowrap;
    cursor: pointer;
    color: $primary;
  }

  .fa-check-circle,
  .fa-check {
    color: $primary;
  }

  @media (min-width: 500px) {
    .user-tabs {
      margin-top: -4.0rem;
      margin-bottom: -1rem;
    }
  }

  .invite-code {
    .code {
      display: inline-block;
      padding-top: 1em;
      font-size: 1.2em;
    }
    .code-button {
      right: 20px;
      bottom: 20px;
      position: absolute;
    }
  }
</style>
