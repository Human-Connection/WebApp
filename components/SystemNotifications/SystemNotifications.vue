<template>
  <div class="system-notification">
    <div v-if="termsAndConditionsUpdate.type === 'termsAndConditions'" class="terms-and-conditions-modal">
      <b-modal :active.sync="isAcceptModalActive" :canCancel=false has-modal-card animation="zoom-in">
        <div class="modal-background"></div>
        <div class="modal-card ">
          <header class="modal-card-head">
            <h4 class="modal-card-title">{{ termsAndConditionsUpdate.title }}</h4>
          </header>
          <section class="modal-card-body">
            <div class="content" v-html="termsAndConditionsUpdate.content">
            </div>
          </section>
          <footer class="modal-card-foot">
            <hc-button color="success"
                        @click="acceptTermsAndConditions()"
                        :isLoading="isAccepting"
                        :disabled="isAccepting">
              <hc-icon class="icon-left" icon="check" /> {{ $t('button.accept' ) }}
            </hc-button>
          </footer>
        </div>
      </b-modal>
    </div>
    <div class="notification-info-wrapper" v-if="notification && notification.type === 'info'">
      <div class="notification is-warning">
        <button v-if="!notification.requireConfirmation && notification.showOnce" class="delete" @click="closeNotification"></button>
        <div v-html="notification.content"></div>
        <div v-if="notification.requireConfirmation" class="has-text-right">
          <a class="confirm-info" href="#">Okay</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { isEmpty, castArray } from 'lodash'
  import {mapGetters} from 'vuex'
  import moment from 'moment'

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
    mounted: function () {
      this.init()
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    },
    methods: {
      async closeNotification () {
        await this.$store.dispatch('auth/patch', {
          $push: {
            systemNotificationsSeen: this.notification._id
          }
        })
        this.notification = null
      },
      init () {
        this.showTermsAndConditions()
        this.showInfo()
        /* switch (this.type.toLowerCase()) {
          case 'termsAndConditions':
            this.showTermsAndConditions()
            break;
          case 'info':
          default:
            this.showInfo()
            break;
        } */
      },
      showTermsAndConditions () {
        this.$api.service('system-notifications').find({
          query: {
            type: 'termsAndConditions',
            $limit: 1,
            language: this.$i18n.locale(),
            $sort: {
              createdAt: -1
            }
          }
        }).then((res) => {
          if (isEmpty(res.data)) {
            return
          }
          this.termsAndConditionsUpdate = res.data[0]
          let hasAccepted = this.user.termsAndConditionsAccepted
          if (!hasAccepted || moment(hasAccepted) < moment(this.termsAndConditionsUpdate.createdAt)) {
            this.isAcceptModalActive = true
          }
        })
      },
      showInfo () {
        let query = {
          type: 'info',
          $limit: 1,
          language: this.$i18n.locale(),
          $sort: {
            createdAt: -1
          }
        }
        const systemNotificationsSeen = this.user.systemNotificationsSeen
        console.log('>> systemNotificationsSeen', systemNotificationsSeen)

        if (!isEmpty(systemNotificationsSeen)) {
          query._id = {
            $nin: systemNotificationsSeen
          }
        }
        console.log('>> query', {query})

        this.$api.service('system-notifications').find({query})
          .then((res) => {
            if(!isEmpty(res.data)) {
              this.notification = res.data[0]
            }
        })
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

  .notification-info-wrapper {
    margin-bottom: 20px;
  }
  .confirm-info {
    text-decoration: none;
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
