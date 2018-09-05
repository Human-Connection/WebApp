<template>
    <section class="container content page-auth-name">
        <div class="card">
            <div class="card-content">
                <div class="card-teaser">
                    <img src="/assets/images/registration/nicetomeetyou.svg" alt="Human Connection"/>
                </div>
                <h1 class="title is-3 is-spaced">{{ $t('auth.account.nameSection') }}</h1>
                <p class="subtitle is-6">{{ $t('auth.account.nameDescription') }}</p>

                <div class="user-avatar">
                  <hc-upload
                    class="avatar-upload"
                    :preview-image="form.avatar || user.avatar"
                    :test="true"
                    @update="onAvatarUploadCompleted"
                    @start-sending="uploadingAvatar = true"
                    @stop-sending="uploadingAvatar = false" >
                    <hc-avatar :user="user" :name="data.name" />
                  </hc-upload>
                </div>

                <random-avataaar @blob="onRandomAvatar" />

                <form @submit.prevent="save">
                    <div class="field">
                        <p class="control has-icons-right">
                            <input
                              v-focus
                              type="text"
                              class="input "
                              :class="{ 'is-danger': errors }"
                              :placeholder="$t('auth.account.namePlaceholder')"
                              autofocus
                              v-model.trim="data.name">
                            <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <p>
            <hc-button color="primary"
                       size="medium"
                       type="button"
                       class="is-fullwidth"
                       :isLoading="isLoading">
              {{ $t('button.save') }}
            </hc-button>
          </p>
        </form>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-welcome' }" class="card-footer-item">
          {{ $t('button.skip') }}
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {isEmpty} from 'lodash'

  import RandomAvataaar from '~/components/Avatar/RandomAvataaar'

  export default {
    layout: 'blank',
    components: {
      RandomAvataaar
    },
    data () {
      return {
        data: {
          name: ''
        },
        form: {
          avatar: null
        },
        errors: null,
        isLoading: false,
        uploadingAvatar: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    methods: {
      async save () {
        this.errors = false
        this.isLoading = true
        this.$store.dispatch('auth/patch', this.data)
          .then(() => {
            this.isLoading = false
            this.$router.push({name: 'auth-welcome'})
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              type: 'is-danger'
            })
            this.errors = true
            this.isLoading = false
          })
      },
      onAvatarUploadCompleted (value) {
        this.form.avatar = value
        this.$store.dispatch('auth/patch', {
          avatar: value
        })
      },
      onRandomAvatar (blob) {
        this.form.avatar = this.url

        let data = {
          avatar: blob
        }
        // also save name
        if (!isEmpty(this.data.name)) {
          data.name = this.data.name
        }

        this.$store.dispatch('auth/patch', data)
      }
    },
    watch: {
      user (user) {
        this.$nextTick(() => {
          this.data.name = user.name
        })
      }
    },
    head () {
      return {
        title: this.$t('auth.account.nameTitle')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/_utilities";

  .page-auth-name {

      .card {
          margin: 0 auto;
          max-width: 460px;
          text-align: center;
          border: none;
          box-shadow: $card-shadow;
      }

      .card-teaser {
        img {
          display: inline-block;
          max-width: 200px;
          height: auto;

          @include tablet {
            max-width: 260px;
          }
        }
      }

      form {
        margin: 1em auto;
        padding: 1em;
        text-align: left;
      }

      .user-avatar {
          $borderRadius: 50%;

          border-radius: $borderRadius;
          width:         120px;
          height:        120px;
          position:      relative;
          display:       inline-block;
          background-color: #fff;
          overflow: hidden;

          .avatar-upload {
              & {
                  border:        none;
                  border-radius: $borderRadius;
                  overflow:      hidden;
                  width:         100%;
                  height:        100%;
                  max-height:    100%;
                  min-height:    100%;
                  max-width:     100%;
                  min-width:     100%;
              }
          }

          .hc-upload.sending {
              i.fa {
                  opacity: 0;
              }

              .hc-upload-progress {
                  bottom: 49% !important;
                  z-index: 10;
              }
          }

          &:before {
              border-radius: 50%;
              content: '';
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 10;
              pointer-events: none;
              box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
          }
      }
  }

</style>
