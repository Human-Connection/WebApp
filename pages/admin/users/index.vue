<template>
  <section class="">
    <h1 class="is-size-3">{{ $t('component.admin.manageUsers', 'Manage Users') }}</h1>
    <br>
    <b-tabs v-model="activeTab" type="is-boxed">
      <b-tab-item label="Users" icon="users">
        <article class="message is-small">
          <div class="message-body">
            <i class="fa fa-info-circle"></i> A list of registered users with their email verification status.
          </div>
        </article>
        <no-ssr>
          <v2-table :data="users.data"
                    :stripe="true"
                    :loading="usersLoading"
                    :total="users.total"
                    :shown-pagination="true"
                    :pagination-info="paginationInfo"
                    @page-change="handleUserPageChange">
            <v2-table-column label="Name" prop="name" align="left" width="250">
              <template slot-scope="row">
                <div @click="openProfile(row)" style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
                  <hc-avatar :user="row" style="display: inline-block; float: left;" />&nbsp;<div style="display: inline-block; padding: 5px 10px;">{{ row.name }}</div>
                </div>
              </template>
            </v2-table-column>
            <v2-table-column label="Verified" prop="isVerified" align="center">
              <template slot-scope="row">
                <i v-show="row.isVerified" class="fa fa-check-circle"></i>
              </template>
            </v2-table-column>
            <v2-table-column label="Lang" prop="language" align="center">
              <template slot-scope="row">
                <template v-if="row.language">
                  <img width="16" :src="`/assets/svg/flags/${row.language}.svg`" />
                </template>
                <template v-else>
                  -
                </template>
              </template>
            </v2-table-column>
            <v2-table-column label="Role" prop="role" align="left"></v2-table-column>
          </v2-table>
        </no-ssr>
      </b-tab-item>
      <b-tab-item label="Invite Codes" icon="ticket">
        <article class="message is-small">
          <div class="message-body">
            <i class="fa fa-info-circle"></i> Here you can invite users by providing a a csv file with at least the email and the language (de/en) of the users to invite.
          </div>
        </article>
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
                    :shown-pagination="true"
                    :pagination-info="paginationInfo"
                    @page-change="handleInvitesPageChange">
            <v2-table-column label="Email" prop="email" align="left" width="250"></v2-table-column>
            <v2-table-column label="Code" prop="code" align="left">
              <template slot-scope="row">
                <a :href="`${baseURL}/auth/register?email=${row.email}&code=${row.code}&lang=${row.language}`">{{ row.code }}</a>
              </template>
            </v2-table-column>
            <v2-table-column label="Lang" prop="language" align="center">
              <template slot-scope="row">
                <img width="16" :src="`/assets/svg/flags/${row.language}.svg`" />
              </template>
            </v2-table-column>
            <v2-table-column label="Role" prop="role" align="left"></v2-table-column>
            <v2-table-column label="Created" prop="created" align="center">
              <template slot-scope="row">
                <i v-show="row.created === true" class="fa fa-check-circle"></i>
                <i v-show="row.created === false" class="fa fa-ban"></i>
              </template>
            </v2-table-column>
          </v2-table>
        </no-ssr>
        <br />
        <div class="field">
          <b-checkbox v-model="form.sendInviteEmails" style="item-align: center" :disabled="isLoading || invitesLoading">Send invite mails</b-checkbox>
        </div>
        <div class="field columns is-mobile">
          <div class="control column">
            <hc-button color="danger"
                       @click="inviteUsers()"
                       :isLoading="isLoading || invitesLoading"
                       :disabled="isLoading || !invitePreview.length || !!resultDownloadURL">
              <hc-icon set="fa" icon="bolt"></hc-icon> &nbsp;<strong>Invite {{ invitePreview.length || 0 }} users
              <span style="font-weight: normal" v-if="form.sendInviteEmails">(with mailing)</span>
              <span style="font-weight: normal" v-else>(no mailing)</span></strong>
            </hc-button>
          </div>
          <div class="control column">
            <a :href="resultDownloadURL"
               class="button pull-right"
               :class="{ 'is-loading': isLoading }"
               :disabled="isLoading || !results || !resultDownloadURL"
               download="data.csv">
              <hc-icon set="fa" icon="download"></hc-icon> &nbsp;<strong>{{ $t('component.admin.-', 'Download CSV') }}</strong>
            </a>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
  import moment from 'moment'
  import parse from 'csv-parse/lib/sync'
  import { isEmpty, each, map, keyBy } from 'lodash'

  let itemLimit = 10

  export default {
    middleware: 'admin',
    layout: 'admin',
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
        invitePreview: [],
        invitePaginated: [],
        inviteResults: [],
        currentPage: 1,
        paginationInfo: {
          text: this.paginationText
        },
        activeTab: null
      }
    },
    async asyncData ({app}) {
      const limit = itemLimit
      const users = await app.$api.service('users').find({
        query: {
          $limit: limit
        }
      })
      return {
        users: users,
        usersLoading: false,
        itemLimit: limit
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
      totalPages () {
        return this.users.total / this.itemLimit
      },
      paginationText () {
        return `<span>Total of <strong>${this.user ? this.user.total : 0}</strong>, <strong>${this.itemLimit}</strong> per page</span>`
      }
    },
    methods: {
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
              message: this.$t('component.admin.-', `You have to select a valid .csv`),
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
                if (!isEmpty(item.email)) {
                  item.email = item.email.trim().toLowerCase()
                  return item
                }
              })
              this.handleInvitesPageChange(1)
            } catch (err) {
              this.$snackbar.open({
                message: this.$t('component.admin.-', `ERROR: ${err.message}`),
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
      openProfile (user) {
        if (user.slug) {
          this.$router.push(`/profile/${user.slug}`)
        }
      },
      inviteUsers () {
        const sendInviteEmails = this.form.sendInviteEmails === true

        const data = map(this.invitePreview, item => Object.assign({}, item))

        this.invitesLoading = true
        this.$api.service('admin').timeout = 240000 // 4 minutes timeout
        this.$api.service('admin').create({ createInvites: data, sendInviteEmails }).then(res => {
          this.$snackbar.open({
            message: this.$t('component.admin.-', `Created ${res.length} of ${this.invitePreview.length} invites`),
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
        const start = (page - 1) * this.itemLimit + 1

        this.users = await this.$api.service('users').find({
          query: {
            $limit: this.itemLimit,
            $skip: start
          }
        })
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

  .fa-check-circle {
    color: $primary;
  }
</style>
