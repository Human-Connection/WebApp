<template>
    <section class="container content page-auth-name">
        <div class="card">
            <div class="card-content">
                <div class="card-teaser">
                    <img src="/assets/images/registration/nicetomeetyou.svg" alt="Human Connection"/>
                </div>
                <h1 class="title is-3 is-spaced">{{ $t('component.organization.createNew') }}</h1>
                <p class="subtitle is-6">{{ $t('component.organization.nameHint') }}</p>

                <div class="user-avatar">
                    <hc-upload class="avatar-upload"
                               :preview-image="form.logo"
                               :test="true"
                               @update="onAvatarUploadCompleted"
                               @start-sending="uploadingLogo = true"
                               @stop-sending="uploadingLogo = false" ></hc-upload>
                </div>

                <form @submit.prevent="save">
                    <div class="field">
                        <p class="control has-icons-right">
                            <input v-focus autofocus class="input " v-bind:class="{ 'is-danger': errors }"
                                   type="text" v-bind:placeholder="$t('component.organization.createOrgaSectionPlaceholder')"
                                   v-model="form.name" autofocus>
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
              {{ $t('button.next') }}
            </hc-button>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'

  export default {
    middleware: 'authenticated',
    layout: 'blank',
    data () {
      return {
        form: {
          logo: null,
          name: ''
        },
        errors: null,
        isLoading: false,
        uploadingLogo: false
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
        this.$store.dispatch('organizations/create', this.form)
          .then((res) => {
            this.isLoading = false
            this.$router.push(`/organizations/${res.slug}`)
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            this.errors = true
            this.isLoading = false
          })
      },
      onAvatarUploadCompleted (value) {
        this.form.logo = value
      }
    },
    head () {
      return {
        title: this.$t('component.organization.createNew')
      }
    }
  }
</script>

<style lang="scss">
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
