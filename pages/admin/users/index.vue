<template>
  <section class="">
    <h1 class="is-size-3">{{ $t('component.admin.manageUsers', 'Manage Users') }}</h1>
    <br>
    <b-tabs v-model="activeTab" type="is-boxed">
      <b-tab-item label="Users">
        <no-ssr>
          <v2-table :data="users.data"
                    :loading="usersLoading"
                    :total="users.total"
                    :shown-pagination="true"
                    :pagination-info="paginationInfo"
                    @page-change="handlePageChange">
            <v2-table-column label="Name" prop="name" align="left" width="250">
              <template slot-scope="row">
                <div @click="openProfile(row)" style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
                  <hc-avatar :user="row" style="display: inline-block; float: left;" />&nbsp;<div style="display: inline-block; padding: 5px 10px;">{{ row.name }}</div>
                </div>
              </template>
            </v2-table-column>
            <v2-table-column label="Verified" prop="isVerified" align="left">
              <template slot-scope="row">
                <i v-show="row.isVerified" class="fa fa-check-circle"></i>
              </template>
            </v2-table-column>
            <v2-table-column label="Lang" prop="language" align="left">
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
      <b-tab-item label="Invite Codes">
        <div class="field isGrouped columns">
          <div class="control column">
            <textarea v-model.trim="form.codes" class="textarea" rows="8" placeholder="name@domain.tld, de                                                       name2@domain.tld, en"></textarea>
          </div>
          <div class="control column">
            <textarea class="textarea" rows="8" readonly placeholder="results">{{ results }}</textarea>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <hc-button color="danger"
                      @click="generateInviteCodes()"
                      :isLoading="isLoading"
                      :disabled="isLoading">
              <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>{{ $t('component.admin.-', 'Generate Invite-Codes') }}</strong>
            </hc-button>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
  import moment from 'moment'
  import parse from 'csv-parse/lib/sync'

  let userLimit = 10

  export default {
    middleware: 'admin',
    layout: 'admin',
    data () {
      return {
        form: {
          codes: ''
        },
        usersLimit: userLimit,
        isLoading: false,
        usersLoading: true,
        results: '',
        users: [],
        currentPage: 1,
        paginationInfo: {
          text: this.paginationText
        },
        activeTab: null
      }
    },
    async asyncData ({app}) {
      const limit = userLimit
      const users = await app.$api.service('users').find({
        query: {
          $limit: limit
        }
      })
      return {
        users: users,
        usersLoading: false,
        usersLimit: limit
      }
    },
    filters: {
      formatDate (val) {
        return moment(val).format('d.m.Y')
      }
    },
    computed: {
      totalPages () {
        return this.users.total / this.usersLimit
      },
      paginationText () {
        return `<span>Total of <strong>${this.user ? this.user.total : 0}</strong>, <strong>${this.usersLimit}</strong> per page</span>`
      }
    },
    methods: {
      openProfile (user) {
        if (user.slug) {
          this.$router.push(`/profile/${user.slug}`)
        }
      },
      generateInviteCodes () {
        let data = this.form.codes.replace(/mailto:/ig, '')
        if (data.indexOf('email,') !== 0) {
          data = 'email, language\n' + data
        }
        const invites = parse(data, {
          columns: true,
          ltrim: true,
          rtrim: true,
          trim: true
        })

        this.isLoading = true
        this.results = ''
        this.$api.service('admin').create({ createInvites: invites }).then(res => {
          this.isLoading = false
          this.$snackbar.open({
            message: this.$t('component.admin.-', `Created ${res.length}/${invites.length} new Invite-Codes`),
            duration: 4000,
            type: 'is-success'
          })
          res.forEach(item => {
            this.results += `${item.email}, ${item.language}, ${item.code}, /auth/register?email=${item.email}&code=${item.code}\n`
          })
        }).catch(err => {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        })
      },
      async handlePageChange (page) {
        this.currentPage = page
        this.usersLoading = true
        const start = (page - 1) * this.usersLimit + 1

        this.users = await this.$api.service('users').find({
          query: {
            $limit: this.usersLimit,
            $skip: start
          }
        })
        this.usersLoading = false
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

  .link {
    white-space: nowrap;
    cursor: pointer;
    color: $primary;
  }

  .fa-check-circle {
    color: $primary;
  }
</style>
