<template>
    <div class="system-notification">
        <div v-if="agbUpdate.type === 'agb'" class="agb-modal">
            <b-modal :active.sync="isAcceptModalActive" :canCancel=false has-modal-card animation="zoom-in">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <section class="modal-card-body">
                        <h2 class="title is-3">
                            {{ agbUpdate.title }}
                        </h2>
                        <hr />
                        <div v-html="agbUpdate.content">
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <hc-button color="success"
                                   @click="acceptAgb()"
                                   :isLoading="isAccepting"
                                   :disabled="isAccepting">
                            <hc-icon class="icon-left" icon="check" /> {{ $t('button.accept' ) }}
                        </hc-button>
                    </footer>
                </div>
            </b-modal>
        </div>
        <div class="notification-info-wrapper" v-if="notification.type === 'info'">
            <div class="notification is-info">
                <div v-html="notification.content"></div>
                <div class="has-text-right">
                    <a class="confirm-info" href="#">Okay</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { isEmpty } from 'lodash'
  import {mapGetters} from 'vuex'

  export default {
    name: 'system-notification',
    components: {
    },
    data () {
      return {
        notification: {},
        agbUpdate: {},
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
      init () {
        this.$api.service('system-notifications').find({
          query: {
            type: 'agb',
            $limit: 1,
            $sort: {
              createdAt: -1
            }
          }
        }).then((res) => {
          if(!isEmpty(res.data)) {
            this.agbUpdate = res.data[0]
            if (this.agbUpdate.type === 'agb'){
              let hasAccepted = this.user.agbAccepted
              if (!hasAccepted){
                this.isAcceptModalActive = true
              }
            }
          }
        })

        this.$api.service('system-notifications').find({
          query: {
            type: 'info',
            $limit: 1,
            $sort: {
              createdAt: -1
            }
          }
        }).then((res) => {
          if(!isEmpty(res.data)) {
            this.notification = res.data[0]
          }
        })
      },
      async acceptAgb () {
        try {
          let data = {agbAccepted : Date.now()}
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
</style>
