<template>
    <div class="system-notification">
        <div class="agb-modal">
            <b-modal :active.sync="isAcceptModalActive" :canCancel=false has-modal-card animation="zoom-in">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <section class="modal-card-body">
                        <h2 class="title is-3">
                            {{ notification.title }}
                        </h2>
                        <hr />
                        <p>
                            {{ notification.content }}
                        </p>
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
            this.notification = res.data[0]
            if (this.notification.type === 'agb'){
              this.isAcceptModalActive = true
            }
          }
        })
      },
      acceptAgb () {
        console.log('ACCEPT AGB')
        this.isAcceptModalActive = false
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";
</style>
