<template>
  <section>
    <div class="createNotificationForm">
      <h3 class="title is-3">{{ $t('component.admin.manageNotifications', 'Manage System Notifications') }}</h3>
      <hr />
      <h4 class="title is-4">{{ $t('component.admin.createNotification', 'Create Notification') }}</h4>
      <div class="field is-required" ref="title">
        <label class="label" for="form-title">{{ $t('component.admin.notificationTitle') }}</label>
        <div class="control" :class="{ 'has-error': $v.form.title.$error }">
          <input
                  class="input"
                  id="form-title"
                  data-test="title"
                  :class="{ 'is-danger': $v.form.title.$error }"
                  maxlength="64"
                  v-model.trim="form.title"
                  @blur="$v.form.title.$touch()"
                  type="text"
                  v-bind:placeholder="$t('component.admin.notificationTitle')"
                  v-bind:disabled="isLoading">
        </div>
        <p :class="{ 'is-hidden': !$v.form.title.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorTitle') }}</p>
      </div>
      <div class="field is-required">
        <label class="label" for="form-content">{{ $t('component.admin.notificationContent') }}</label>
        <div class="control" :class="{ 'has-error': $v.form.content.$error }">
          <hc-editor
                  identifier="content"
                  id="form-content"
                  data-test="content"
                  v-model.trim="form.content"
                  :class="{ 'is-danger': $v.form.content.$error }"
                  @blur="$v.form.content.$touch()"
                  :loading="isLoading"
                  :editorOptions="editorOptions"></hc-editor>
        </div>
        <p :class="{ 'is-hidden': !$v.form.content.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorContent') }}</p>
      </div>
      <div class="field">
        <div class="is-normal">
          <label class="label">{{ $t('component.admin.notificationType') }}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control has-icons-left">
              <div class="select">
                <select v-model="form.type">
                  <option value="info">{{ $t('component.admin.notificationTypeInfo') }}</option>
                  <!--
                  <option value="patchnotes" >{{ $t('component.admin.notificationTypePatchNotes') }}</option>
                  <option value="announcement">{{ $t('component.admin.notificationTypeAnnouncement') }}</option>
                  -->
                  <option value="agb">{{ $t('component.admin.notificationTypeAgbUpdate') }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="is-normal">
          <label class="label">{{ $t('component.admin.notificationLanguage') }}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control has-icons-left">
              <div class="select">
                <select v-model="form.language">
                  <option value="de">{{ $t('component.admin.notificationLanguageDE') }}</option>
                  <option value="en">{{ $t('component.admin.notificationLanguageEN') }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="is-normal">
          <label class="label">{{ $t('component.admin.notificationSlot') }}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control has-icons-left">
              <div class="select">
                <select v-model="form.slot">
                  <option value="top">{{ $t('component.admin.notificationSlotTop') }}</option>
                  <!--
                  <option value="contribution" >{{ $t('component.admin.notificationSlotContribution') }}</option>
                  <option value="profile">{{ $t('component.admin.notificationSlotProfile') }}</option>
                  -->
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label is-required" for="form-showOnce">{{ $t('component.admin.notificationOnce') }}</label>
        <div class="control" id="form-showOnce">
          <b-switch
                  v-model="form.showOnce"
                  @click.native="toggleMode('once')">
            {{ $t('component.admin.activate', 'Activate') }}
          </b-switch>
        </div>
      </div>
      <div class="field">
        <label class="label is-required" for="form-requireConfirmation">{{ $t('component.admin.notificationConfirm') }}</label>
        <div class="control" id="form-requireConfirmation">
          <b-switch
                  v-model="form.requireConfirmation"
                  @click.native="toggleMode('confirmation')">
            {{ $t('component.admin.activate', 'Activate') }}
          </b-switch>
        </div>
      </div>
      <hr />
      <div class="field is-grouped is-grouped-left">
        <div class="control">
          <hc-button :isLoading="isLoading"
                     :disabled="isLoading"
                     @click.prevent="createNotification">
            <i class="fa fa-bullhorn"></i>
            &nbsp;<span>{{ $t('component.admin.createLabel', 'Create') }}</span>
          </hc-button>
        </div>
      </div>
    </div>
    <div class="notificationList">
      <no-ssr>
        <v2-table :data="notifications.data"
                  :stripe="true"
                  :loading="notificationsLoading"
                  :total="notifications.total"
                  :shown-pagination="true"
                  :pagination-info="paginationInfo"
                  @page-change="handleNotificationPageChange">
            <v2-table-column label="Title" prop="title" align="center">
                <template slot-scope="row">
                    {{ row.title }}
                </template>
            </v2-table-column>
            <v2-table-column label="Type" prop="type" align="center">
                <template slot-scope="row">
                    {{ row.type }}
                </template>
            </v2-table-column>
            <v2-table-column label="Slot" prop="slot" align="center">
              <template slot-scope="row">
                {{ row.slot }}
              </template>
            </v2-table-column>
          <v2-table-column label="Language" prop="language" align="center">
            <template slot-scope="row">
              {{ row.language }}
            </template>
          </v2-table-column>
            <v2-table-column label="Created" prop="createdAt" align="center">
              <template slot-scope="row">
                {{ row.createdAt }}
              </template>
            </v2-table-column>
        </v2-table>
      </no-ssr>
    </div>
  </section>
</template>

<script>
  import moment from 'moment'
  import { isEmpty, map, keyBy } from 'lodash'
  import { mapGetters } from 'vuex'
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  let itemLimit = 10

  export default {
    middleware: 'admin',
    layout: 'admin',
    mixins: [animatable, validationMixin],
    data () {
      const i18nEditorPlaceholder = this.$t('component.contribution.writePostContentPlaceholder')
      return {
        form: {
          _id: '',
          type: 'info',
          title: '',
          content: '',
          language: 'de',
          slot: 'top',
          requireConfirmation: false,
          showOnce: true
        },
        itemLimit: itemLimit,
        notificationsLoading: true,
        notifications: [],
        isLoading: false,
        disabled: false,
        currentPage: 1,
        paginationInfo: {
          text: '', // this.paginationText,
          nextPageText: '>',
          prevPageText: '<'
        },
        editorOptions: {
          placeholder: i18nEditorPlaceholder
        },
      }
    },
    validations () {
      let rules = {
        title: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(64)
        },
        content: {
          required
        },
        type: {
          required
        },
        slot: {
          required
        }
      }

      return {
        form: rules
      }
    },
    async asyncData ({app}) {
      const limit = itemLimit
      const systemNotifications = await app.$api.service('system-notifications').find({
        query: {
          $limit: limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      return {
        notifications: systemNotifications,
        notificationsLoading: false,
        itemLimit: limit
      }
    },
    filters: {
      formatDate (val) {
        return moment(val).format('d.m.Y')
      }
    },
    computed: {
      totalPages () {
        return this.notifications.total / this.itemLimit
      },
      paginationText () {
        return `<span>Total of <strong>${this.notifications ? this.notifications.total : 0}</strong>, <strong>${this.itemLimit}</strong> per page</span>`
      }
    },
    methods: {
      toggleMode (mode) {
        if (mode === 'once') {
          this.form.showOnce = !this.form.showOnce
        }

        if (mode === 'confirmation') {
          this.form.requireConfirmation = !this.form.requireConfirmation
        }
      },
      async createNotification() {
        if (this.$v.form.$invalid) {
          this.animate('shake')
          this.$toast.open({
            message: this.$t('component.contribution.validationError'),
            type: 'is-danger'
          })
          setTimeout(() => {
            this.$scrollTo(this.$refs.title, 500)
            this.$v.form.$touch()
          }, 500)
          return
        }

        this.isLoading = true

        try {
          let formData = Object.assign({}, this.form)
          let res = await this.$api.service('system-notifications').create(formData)
          if(!isEmpty(res)) {
            const systemNotifications = await this.$api.service('system-notifications').find({
              query: {
                $limit: this.itemLimit,
                $sort: {
                  createdAt: -1
                }
              }
            })
            this.form.title = ''
            this.form.content = ''
            this.notifications = systemNotifications
            this.isLoading = false
            this.$snackbar.open({
              message: this.$t('component.admin.createNotificationSuccess'),
              duration: 4000,
              type: 'is-success'
            })
          }
        } catch (err) {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        }
      },
      async handleNotificationPageChange (page) {
        this.currentPage = page
        this.notificationsLoading = true
        const start = (page - 1) * this.itemLimit + 1

        this.notifications = await this.$api.service('system-notifications').find({
          query: {
            $limit: this.itemLimit,
            $skip: start
          }
        })
        this.notificationsLoading = false
      },
    },
    head () {
      return {
        title: 'System Notifications verwalten'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .field {
    margin-bottom: 10px;
    .label {
      margin-bottom: 5px;
    }
  }

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
