<template>
  <div>
    <div class="avatar-wrapper">
      <div class="user-avatar">
        <hc-upload class="avatar-upload"
                    :preview-image="form.logo"
                    :test="true"
                    :circular="false"
                    @update="onAvatarUploadCompleted"
                    @start-sending="uploadingLogo = true"
                    @stop-sending="uploadingLogo = false" />
      </div>
    </div>
    <div class="field">
      <div class="control has-icons-right"
            :class="{ 'has-error': $v.form.name.$error }">
        <label class="label is-required" for="form-name">{{ $t('component.organization.name') }}</label>
        <input v-focus="autoFocus"
                id="form-name"
                class="input "
                type="text"
                :placeholder="$t('component.organization.createOrgaSectionPlaceholder')"
                v-model="form.name">
        <p class="small-info">{{ $t('component.organization.nameHint') }}</p>
      </div>
      <p :class="{ 'is-hidden': !$v.form.name.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
    </div>
    <div class="field">
      <div class="control"
            :class="{ 'has-error': $v.form.language.$error }">
        <label class="label is-required" for="form-orgaLanguages">{{ $t('component.organization.organizationLanguageSelection') }}</label>
        <div class="block" id="form-orgaLanguages">
          <b-radio v-model="form.language"
                    @input="$v.form.language.$touch()"
                    native-value="de">
            Deutsch
          </b-radio>
          <b-radio v-model="form.language"
                    @input="$v.form.language.$touch()"
                    native-value="en">
            English
          </b-radio>
          <p :class="{ 'is-hidden': !$v.form.language.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
        </div>
      </div>
    </div>
    <div class="field has-margin-top-small" v-if="hideButton">
      <div class="control">
        <label class="label">{{ $t('component.organization.visibility') }}</label>
        <b-switch v-model="form.isEnabled" :disabled="!canEnable">
          <span v-if="form.isEnabled">{{ $t('info.active') }}</span>
          <span v-else>{{ $t('info.inactive') }}</span>
        </b-switch>
      </div>
    </div>
    <slot v-if="!hideButton">
      <hc-button color="primary"
                @click.prevent="validate()"
                size="medium"
                type="button"
                class="is-fullwidth"
                :isLoading="isLoading"
                :disabled="isLoading">
        {{ $t('button.next') }} <hc-icon class="icon-right" icon="angle-right" />
      </hc-button>
    </slot>
  </div>
</template>

<script>
  import { validationMixin } from "vuelidate";
  import { required, minLength, maxLength } from "vuelidate/lib/validators";

  export default {
    mixins: [validationMixin],
    props: {
      data: {
        type: Object
      },
      hideButton: {
        type: Boolean,
        default: false
      },
      canEnable: {
        type: Boolean,
        default: false
      },
      autoFocus: {
        type: Boolean,
        default: true
      }
    },
    name: 'orga-form-step-1',
    data () {
      return {
        form: {
          logo: null,
          name: '',
          language: this.$i18n.locale(),
          isEnabled: false
        },
        isLoading: false,
        uploadingLogo: false
      }
    },
    watch: {
      data (data) {
        this.updateData(data)
      },
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      },
      uploadingLogo (uploadingLogo) {
        this.$emit('disabled', uploadingLogo)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.updateData(this.data)
      })
    },
    methods: {
      updateData (data) {
        this.form = Object.assign(this.form, {
          logo: data.logo,
          name: data.name,
          language: data.language,
          isEnabled: data.isEnabled
        })
      },
      validate () {
        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          this.$emit('validate', this.form)
        }
      },
      onAvatarUploadCompleted(value) {
        this.form.logo = value;
      }
    },
    validations() {
      return {
        form: {
          name: {
            required,
            minLength: minLength(3),
            maxLength: maxLength(100)
          },
          language: {
            required
          }
        }
      };
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-wrapper {
    width: 100%;
    justify-content: center;
    display: flex;
    padding: 0 0 2rem;

    .user-avatar {
      // $borderRadius: 0;
      // border-radius: $borderRadius !important;
      width: 100%;
      height: 120px;
      // border: none;
      position: relative;
      display: inline-block;
      background-color: #fff;

      .avatar-upload {
        background-color: #fff;

        &, & > div {
          border: none;
          // border-radius: $borderRadius;
          overflow: hidden;
          width: 100%;
          height: 100%;
          max-height: 100%;
          min-height: 100%;
          max-width: 100%;
          min-width: 100%;

          // img {
          //   background-color: #fff;
          //   object-fit:    contain !important;
          // }
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
        // border-radius: 50%;
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        pointer-events: none;
        // box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
