<template>
  <section>
    <div class="createNotificationForm">
      <h3 class="title is-3">{{ $t('component.admin.manageNotifications', 'Manage System Notifications') }}</h3>
      <b-modal :active.sync="isCreateModalActive" has-modal-card animation="zoom-in">
        <div class="modal-background"></div>
        <div class="modal-card" :class="classes">
          <header class="modal-card-head">
            <h4 class="modal-card-title">{{ $t('component.admin.createNotification', 'Create Notification') }}</h4>
          </header>
          <section class="modal-card-body" ref="modalContent">
            <div class="field is-required" ref="title">
              <label class="label" for="form-title">{{ $t('component.admin.labelTitle') }}</label>
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
                        :placeholder="$t('component.admin.labelTitle')"
                        :disabled="isLoading">
              </div>
              <p :class="{ 'is-hidden': !$v.form.title.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorTitle') }}</p>
            </div>
            <div class="field is-required">
              <label class="label" for="form-content">{{ $t('component.admin.labelContent') }}</label>
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
            <div class="columns">
              <div class="column">
                <div class="field">
                  <div class="is-normal">
                    <label class="label">{{ $t('component.admin.labelType') }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select">
                          <select v-model="form.type">
                            <option value="info">{{ $t('component.admin.notificationTypeInfo') }}</option>
                            <!--
                            <option value="patchnotes" >{{ $t('component.admin.notificationTypePatchNotes') }}</option>
                            <option value="announcement">{{ $t('component.admin.notificationTypeAnnouncement') }}</option>
                            -->
                            <option value="termsAndConditions">{{ $t('component.admin.notificationTypeTermsAndConditions') }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <div class="is-normal">
                    <label class="label">{{ $t('component.admin.labelLanguage') }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select">
                          <select v-model="form.language">
                            <option value="de">{{ $t('component.admin.languageDE') }}</option>
                            <option value="en">{{ $t('component.admin.languageEN') }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--<div class="column">
                <div class="field">
                  <div class="is-normal">
                    <label class="label">{{ $t('component.admin.notificationSlot') }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select">
                          <select v-model="form.slot">
                            <option value="top">{{ $t('component.admin.notificationSlotTop') }}</option>-->
                            <!--
                            <option value="contribution" >{{ $t('component.admin.notificationSlotContribution') }}</option>
                            <option value="profile">{{ $t('component.admin.notificationSlotProfile') }}</option>
                            -->
                          <!--</select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>-->
            </div>

            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label is-required" for="form-requireConfirmation">
                    <i class="fa icon-left" :class="{'fa-square-o': !form.requireConfirmation, 'fa-check-square-o': form.requireConfirmation}"></i>{{ $t('component.admin.notificationConfirm') }}
                  </label>
                  <div class="control" id="form-requireConfirmation">
                    <b-switch
                            :disabled="form.type === 'termsAndConditions'"
                            v-model="form.requireConfirmation"
                            @click.native="toggleMode('confirmation')">
                      {{ $t(`button.${form.requireConfirmation ? 'yes' : 'no'}`) }}
                    </b-switch>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label class="label is-required" for="form-permanent">
                    <i class="fa icon-left" :class="{'fa-lock': form.permanent, 'fa-unlock': !form.permanent}"></i>{{ $t('component.admin.notificationPermanent') }}
                  </label>
                  <div class="control" id="form-permanent">
                    <b-switch
                            :disabled="form.type === 'termsAndConditions' || form.requireConfirmation"
                            v-model="form.permanent"
                            @click.native="toggleMode('once')">
                      {{ $t(`button.${form.permanent ? 'yes' : 'no'}`) }}
                    </b-switch>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label is-required" for="form-requireConfirmation">
                    {{ $t('component.admin.labelActive') }}
                  </label>
                  <div class="control" id="form-requireConfirmation">
                    <b-switch
                            :disabled="form.type === 'termsAndConditions'"
                            v-model="form.active">
                    </b-switch>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </section>
          <footer class="modal-card-foot">
            <hc-button color="light" @click.prevent="isCreateModalActive = false">
              <hc-icon icon="times" />
              &nbsp; {{ $t('button.cancel') }}
            </hc-button>
            <hc-button color="success"
                        @click="createNotification"
                        :isLoading="isLoading"
                        :disabled="isLoading">
              <hc-icon class="icon-left" icon="bullhorn" /> {{ $t('component.admin.createLabel', 'Created') }}
            </hc-button>
          </footer>
        </div>
      </b-modal>
      <div class="notificationList">
        <v2-table :data="notifications.data"
                  :stripe="true"
                  :loading="notificationsLoading"
                  :total="notifications.total"
                  :shown-pagination="totalPages > 1"
                  :pagination-info="paginationInfo"
                  @page-change="handleNotificationPageChange">
          <v2-table-column label="Title" prop="title" align="left">
            <template slot-scope="row">
                {{ row.title }}
            </template>
          </v2-table-column>
          <v2-table-column label="Type" prop="type" align="left">
            <template slot-scope="row">
              {{ $t(`component.admin.notificationType${upperFirst(row.type)}`) }}
            </template>
          </v2-table-column>
          <v2-table-column label="" prop="slot" align="center" width="46">
            <template slot-scope="row">
              <div style="display: inline-block;">
                <!-- requireConfirmation -->
                <i v-if="row.requireConfirmation" class="fa fa-check-square-o"></i>
                <i v-else class="fa fa-square-o"></i>
              </div>&nbsp;
              <div style="display: inline-block;">
                <!-- show once -->
                <i v-if="!row.requireConfirmation && row.permanent" class="fa fa-lock"></i>
                <i v-else class="fa fa-unlock"></i>
              </div>
            </template>
          </v2-table-column>
          <v2-table-column label="" prop="language" align="right" width="32">
            <template slot-scope="row">
              <img width="16" :src="`/assets/svg/flags/${row.language}.svg`" />
            </template>
          </v2-table-column>
          <v2-table-column label="Active" prop="createdAt" align="right" width="60">
            <template slot-scope="row" v-show="row.active">
              <a @click.prevent="toggleActiveState(row)">
                <i v-if="row.active" class="fa fa-lg fa-toggle-on"></i>
                <i v-else class="fa fa-lg fa-toggle-off"></i>
              </a>
            </template>
          </v2-table-column>
        </v2-table>
      </div>
    </div>
    <footer class="card-footer">
      <div class="field is-grouped">
        <div class="control">
          <hc-button color="grey" @click.prevent="isCreateModalActive = true">
            <hc-icon icon="plus" />
            &nbsp; {{ $t('button.add') }}
          </hc-button>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
  import moment from 'moment'
  import { isEmpty, map, keyBy, upperFirst } from 'lodash'
  import { mapGetters } from 'vuex'
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  let itemLimit = 10
  const defaultForm = {
    type: 'info',
    title: '',
    content: '',
    language: 'de',
    active: true,
    slot: 'top',
    requireConfirmation: false,
    permanent: false
  }

  export default {
    middleware: 'admin',
    layout: 'admin',
    mixins: [animatable, validationMixin],
    data () {
      const i18nEditorPlaceholder = this.$t('component.contribution.writePostContentPlaceholder')
      return {
        form: Object.assign({}, defaultForm),
        isCreateModalActive: false,
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
          placeholder: this.$t('component.admin.labelContent')
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
    watch: {
      isCreateModalActive (val) {
        this.form = Object.assign({}, defaultForm)
        this.$v.$reset()
      },
      'form.requireConfirmation' (val) {
        if (val) {
          this.form.permanent = false
        }
      },
      'form.type' (val) {
        if (val === 'termsAndConditions') {
          this.form.requireConfirmation = true
          this.form.permanent = false
        }
      }
    },
    methods: {
      async toggleActiveState (notification) {
        await this.$api.service('system-notifications').patch(notification._id, {
          active: !notification.active
        })
        notification.active = !notification.active
        this.$snackbar.open({
          message: this.$t('auth.settings.saveSettingsSuccess'),
          duration: 2000,
          type: 'is-success'
        })
      },
      upperFirst (val) {
        return upperFirst(val)
      },
      toggleMode (mode) {
        if (mode === 'once') {
          this.form.permanent = !this.form.permanent
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
            this.$scrollTo(this.$refs.title, 500, {
              container: this.$refs.modalContent
            })
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
              type: 'is-success'
            })

            this.isCreateModalActive = false
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
        const start = (page - 1) * this.itemLimit

        this.notifications = await this.$api.service('system-notifications').find({
          query: {
            $limit: this.itemLimit,
            $skip: start,
            $sort: {
              createdAt: -1
            }
          }
        })
        this.notificationsLoading = false
      },
    },
    head () {
      return {
        title: this.$t('component.admin.manageNotifications', 'Manage System Notifications')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';
  @import "assets/styles/_animations";


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

  .fa-toggle-off {
    color: $red;
  }
</style>
