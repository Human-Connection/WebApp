<template>
  <section>
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
                :editorOptions="editorOptions"/>
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
                <option value="patchnotes" >{{ $t('component.admin.notificationTypePatchNotes') }}</option>
                <option value="announcement">{{ $t('component.admin.notificationTypeAnnouncement') }}</option>
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
                <option value="contribution" >{{ $t('component.admin.notificationSlotContribution') }}</option>
                <option value="profile">{{ $t('component.admin.notificationSlotProfile') }}</option>
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
  </section>
</template>

<script>
  import moment from 'moment'
  import { isEmpty, each, map, keyBy } from 'lodash'
  import animatable from '~/components/mixins/animatable'
  import { mapGetters } from 'vuex'
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
          slot: 'top',
          requireConfirmation: false,
          showOnce: true
        },
        itemLimit: itemLimit,
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
    filters: {
      formatDate (val) {
        return moment(val).format('d.m.Y')
      }
    },
    computed: {
      totalPages () {
        return this.users.total / this.itemLimit
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
          let res = null
          console.log(formData)
          if (this.form._id) {
            res = await this.$api.service('system-notifications').patch(formData._id, formData)
          } else {
            res = await this.$api.service('system-notifications').create(formData)
          }
          console.log(res)
          this.$snackbar.open({
            message: this.$t('component.contribution.messageSaveSuccess'),
            duration: 4000,
            type: 'is-success'
          })
        } catch (err) {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        }
      }
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
