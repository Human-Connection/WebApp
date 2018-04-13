<template>
  <div>
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.profileWelcome') }}
      </h2>
      <p>{{ $t('auth.settings.profileWelcomeText') }}</p>
    </div>
    <hr>
    <div class="columns" style="position: relative;">
      <div class="column">
        <div class="field">
          <label class="label" for="form-username">{{ $t('auth.settings.yourName', 'Your Name:') }}</label>
          <div class="control has-icons-left" id="form-username">
            <input
              class="input"
              type="text"
              placeholder="Anonymus"
              v-model="form.name">
            <span class="icon is-small is-left">
              <i class="fa fa-user"></i>
            </span>
          </div>
          <!--<p class="help is-success">This username is available</p>-->
        </div>
        <div class="field">
          <label class="label" for="form-email">{{ $t('auth.settings.yourEmail', 'Your Email:') }}</label>
          <div class="control has-icons-left" id="form-email">
            <input
              disabled
              class="input"
              type="text"
              placeholder="mail@domain.com"
              :value="user.email">
            <span class="icon is-small is-left">
              <i class="fa fa-envelope"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="column has-text-centered">
        <label class="label" for="form-avatar">{{ $t('auth.settings.yourAvatar', 'Your Avatar:') }}</label>
        <div class="user-avatar" id="form-avatar">
          <hc-upload
            class="avatar-upload"
            :preview-image="form.avatar || user.avatar"
            :test="true"
            @update="onAvatarUploadCompleted"
            @start-sending="uploadingAvatar = true"
            @stop-sending="uploadingAvatar = false" >
            <hc-avatar :user="user" :name="form.name" />
          </hc-upload>
        </div>

        <random-avataaar @blob="onRandomAvatar" />
      </div>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
    <footer class="card-footer">
      <hc-button
        :isLoading="isLoading"
        :disabled="isLoading"
        @click.prevent="save">
        <i class="fa fa-check"></i>
        &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
      </hc-button>
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import RandomAvataaar from "~/components/Avatar/RandomAvataaar";
  import { isEmpty } from "lodash";

  export default {
    components: {
      RandomAvataaar
    },
    data() {
      return {
        form: {
          name: "",
          avatar: null
        },
        isLoading: false
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.form.name = this.user.name;
      })
    },
    methods: {
      async save() {
        this.isLoading = true;
        try {
          let data = Object.assign({}, this.form)
          // do not overwrite the avatar which is saved on change
          delete data.avatar

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
        this.isLoading = false;
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
        if (!isEmpty(this.form.name)) {
          data.name = this.form.name
        }

        this.$store.dispatch('auth/patch', data)
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    }
  };
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";

  .user-avatar {
    $borderRadius: 50%;

    border-radius: $borderRadius;
    width: 120px;
    height: 120px;
    position: relative;
    display: inline-block;
    background-color: #fff;
    overflow: hidden;

    .avatar-upload {
      & {
        border: none;
        border-radius: $borderRadius;
        overflow: hidden;
        width: 100%;
        height: 100%;
        max-height: 100%;
        min-height: 100%;
        max-width: 100%;
        min-width: 100%;
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
      content: "";
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
</style>

