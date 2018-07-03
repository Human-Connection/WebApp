<template>
  <div class="system-notification">
    <div v-if="termsAndConditionsUpdate.type === 'termsAndConditions'" class="terms-and-conditions-modal">
      <b-modal :active.sync="isAcceptModalActive" :canCancel=false has-modal-card animation="zoom-in">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <h4 class="modal-card-title">{{ termsAndConditionsUpdate.title }}</h4>
          </header>
          <section class="modal-card-body">
            <div class="content" v-html="termsAndConditionsUpdate.content">
            </div>
          </section>
          <footer class="modal-card-foot">
            <hc-button color="success"
                        @click="acceptTermsAndConditions"
                        :isLoading="isAccepting"
                        :disabled="isAccepting">
              <hc-icon class="icon-left" icon="check" /> {{ $t('button.accept' ) }}
            </hc-button>
          </footer>
        </div>
      </b-modal>
    </div>
    <transition name="slide-up">
      <article class="message is-info" v-if="notification && notification.type === 'info'">
        <div class="message-body content">
          <div class="header">
            <h2 class="title is-5">{{ notification.title }}</h2>
          </div>
          <div v-html="notificationContent"></div>
          <div v-if="notification.requireConfirmation">
            <a class="confirm-info button is-info notifications" @click.prevent="closeNotification">{{ $t('button.okay') }}</a>
          </div>
          <button v-if="!notification.requireConfirmation && !notification.permanent" class="delete" @click.prevent="closeNotification"></button>
        </div>
      </article>
    </transition>
  </div>
</template>

<script>
  import { isEmpty, castArray } from 'lodash'
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  import linkifyHtml from 'linkifyjs/html'

  export default {
    name: 'system-notification',
    props: {
      type: {
        type: String,
        default: 'info'
      }
    },
    data () {
      return {
        notification: {},
        termsAndConditionsUpdate: {},
        isAccepting: false,
        isAcceptModalActive: false
      }
    },
    mounted () {
      this.init()

      this.$api
        .service('system-notifications')
        .on('created', () => {
          if (!this.notification) this.init()
        })
        .on('patched', (data) => this.updateNotification(data, 'patched'))
        .on('removed', (data) => this.updateNotification(data, 'removed'))
    },
    beforeDestroy () {
      this.$api
        .service('system-notifications')
        .off('created')
        .off('patched')
        .off('removed')
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      }),
      notificationContent () {
        return linkifyHtml(this.notification.content || '')
      }
    },
    methods: {
      async updateNotification (data, type) {
        console.log(data)
        const isNotificationVisible = this.notification && this.notification._id
        const isCurrent = isNotificationVisible && this.notification._id.toString() === data._id.toString()
        console.log('isNotificationVisible', isNotificationVisible)
        console.log('isCurrent', isCurrent)

        // if (type === 'patched' && isCurrent) {
        //   this.notification = data
        // } else if (isNotificationVisible) {
        //   }
        if (isCurrent) {
          this.notification = {}
        }
        this.init()
      },
      async closeNotification () {
        await this.$store.dispatch('auth/patch', {
          $push: {
            systemNotificationsSeen: this.notification._id
          }
        })
        this.notification = null
      },
      init () {
        if (this.user) {
          this.showTermsAndConditions()
        }
        this.showInfo()
      },
      async showTermsAndConditions () {
        const hasAccepted = this.user.termsAndConditionsAccepted
        let query = {
          type: 'termsAndConditions',
          $limit: 1,
          language: this.$i18n.locale(),
          active: true,
          $sort: {
            createdAt: -1
          }
        }
        if (hasAccepted) {
          query.createdAt = {
            $gt: this.user.termsAndConditionsAccepted
          }
        }
        try {
          const res = await this.$api.service('system-notifications').find({query})
          if (!isEmpty(res.data)) {
            this.termsAndConditionsUpdate = res.data[0]
            this.isAcceptModalActive = true
          }
        } catch (err) {}
      },
      async showInfo () {
        let query = {
          type: 'info',
          $limit: 1,
          language: this.$i18n.locale(),
          active: true,
          $sort: {
            createdAt: -1
          }
        }

        const systemNotificationsSeen = this.user ? this.user.systemNotificationsSeen: []
        if (!isEmpty(systemNotificationsSeen)) {
          query._id = {
            $nin: systemNotificationsSeen
          }
        }

        if (!this.user) {
          query.permanent = true
        }

        try {
          const res = await this.$api.service('system-notifications').find({query})
          if(!isEmpty(res.data)) {
            this.notification = res.data[0]
            // fix layout issues for affix elements
            this.$nextTick(() => window.dispatchEvent(new Event('scroll')))
          }
        } catch (err) {}
      },
      async acceptTermsAndConditions () {
        try {
          let data = {termsAndConditionsAccepted : Date.now()}
          await this.$store.dispatch("auth/patch", data)

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isAcceptModalActive = false
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .confirm-info {
    text-decoration: none;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: .8rem;
    font-weight: bold;
  }

  .modal {
    .modal-background {
      opacity: 0.8;
    }
  }

  .content {
    padding-bottom: 2rem;
  }
</style>
