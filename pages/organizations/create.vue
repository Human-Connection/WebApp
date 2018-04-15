<template>
  <section class="container page-auth-name">
    <div class="card" :class="classes">
      <div class="card-content">
        <div class="card-teaser">
          <img src="/assets/images/registration/nicetomeetyou.svg" alt="Human Connection"/>
        </div>
        <h1 class="title is-3 is-spaced">{{ $t('component.organization.createNew') }}</h1>
        <ul class="steps is-horizontal">
          <li class="steps-segment"
              :class="{ 'is-active': step === 1 }">
            <a @click="toStep(1)" class="steps-marker">1</a>
          </li>
          <li class="steps-segment"
              :class="{ 'is-active': step === 2 }">
            <a @click="toStep(2)" class="steps-marker">2</a>
          </li>
          <li class="steps-segment">
            <span class="steps-marker">
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
            </span>
          </li>
        </ul>
        <form @submit.prevent="save">
          <transition :name="transitionName">
            <div key="step1" v-if="step === 1">
              <p class="subtitle is-6">{{ $t('component.organization.nameHint') }}</p>
              <div class="avatar-wrapper">
                <div class="user-avatar">
                  <hc-upload class="avatar-upload"
                              :preview-image="form.logo"
                              :test="true"
                              @update="onAvatarUploadCompleted"
                              @start-sending="uploadingLogo = true"
                              @stop-sending="uploadingLogo = false" ></hc-upload>
                </div>
              </div>
              <div class="field">
                <div class="control has-icons-right"
                     :class="{ 'has-error': $v.form.name.$error }">
                  <label class="label is-required" for="form-name">{{ $t('component.organization.name') }}</label>
                  <input v-focus
                         autofocus
                         id="form-name"
                         class="input "
                         :class="{ 'is-danger': errors }"
                         type="text"
                         :placeholder="$t('component.organization.createOrgaSectionPlaceholder')"
                         v-model="form.name">
                  <span v-if="errors" class="icon is-small is-right">
                    <i class="fa fa-warning"></i>
                  </span>
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

              <hc-button color="primary"
                          @click.prevent="toStep(2)"
                          size="medium"
                          type="button"
                          class="is-fullwidth"
                          :isLoading="isLoading"
                          :disabled="isLoading">
                {{ $t('button.next') }} <hc-icon class="icon-right" icon="angle-right" />
              </hc-button>
            </div>
            <div key="step2" v-if="step === 2">
              <article class="message is-small">
                <div class="message-body">
                  <i class="fa fa-warning"></i> {{ $t('component.organization.requiredHint') }}
                </div>
              </article>
              <div class="field"
                   :class="{ 'has-error': $v.form.description.$error }">
                <label class="label is-required" for="form-description">{{ $t('component.organization.orgaDescriptionPlaceholder', 'describe the organization') }}</label>
                <hc-editor
                  identifier="description"
                  id="form-description"
                  data-test="description"
                  v-model.trim="form.description"
                  :class="{ 'is-danger': $v.form.description.$error }"
                  @blur="$v.form.description.$touch()"
                  :loading="isLoading"></hc-editor>
                <p :class="{ 'is-hidden': !$v.form.description.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
              </div>
              <div class="field"
                   :class="{ 'has-error': $v.form.type.$error }">
                <label class="label is-required">{{ $t('component.organization.type') }}</label>
                <div class="field-body">
                  <div class="field">
                    <div class="control has-icons-left">
                      <div class="select">
                        <select v-model="form.type">
                          <option value="ngo" selected>{{ $t('component.organization.types.ngo') }}</option>
                          <option value="npo">{{ $t('component.organization.types.npo') }}</option>
                          <option value="goodpurpose">{{ $t('component.organization.types.goodpurpose') }}</option>
                          <option value="ev">{{ $t('component.organization.types.ev') }}</option>
                          <option value="eva">{{ $t('component.organization.types.eva') }}</option>
                        </select>
                        <div class="icon is-small is-left">
                          <i class="fa fa-cogs"></i>
                        </div>
                      </div>
                    </div>
                  <p :class="{ 'is-hidden': !$v.form.type.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
                  </div>
                </div>
              </div>
              <br />
              <div class="field"
                   :class="{ 'has-error': $v.form.categoryIds.$error }">
                <label class="label is-required">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
                <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
                <p :class="{ 'is-hidden': !$v.form.categoryIds.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
              </div>
              <hc-button color="primary"
                          @click.prevent="save"
                          size="medium"
                          type="button"
                          class="is-fullwidth"
                          :isLoading="isLoading"
                          :disabled="isLoading">
                <hc-icon class="icon-left" icon="check" /> {{ $t('button.create') }}
              </hc-button>
            </div>
          </transition>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import animatable from "~/components/mixins/animatable";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import CategoriesSelect from "~/components/Categories/CategoriesSelect.vue";
import { mapGetters } from "vuex";

export default {
  middleware: "authenticated",
  layout: "blank",
  mixins: [animatable, validationMixin],
  components: {
    "categories-select": CategoriesSelect
  },
  data() {
    return {
      form: {
        logo: null,
        name: "",
        type: "",
        isEnabled: false,
        description: "",
        categoryIds: [],
        language: this.$i18n.locale()
      },
      step: 1,
      transitionName: 'slide-next',
      errors: null,
      isLoading: false,
      uploadingLogo: false
    };
  },
  validations() {
    let rules = {};
    if (this.step === 1) {
      rules = {
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
    } else {
      rules = {
        form: {
          type: {
            required
          },
          categoryIds: {
            required
          },
          description: {
            required,
            minLength: minLength(10)
          }
        }
      };
    }
    return rules;
  },
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.toStep(1)
    });
  },
  methods: {
    toStep(step) {
      this.transitionName = (step > this.step) ? 'slide-next' : 'slide-prev'

      if (step > this.step && this.$v.form.$invalid) {
        this.$v.form.$touch()
        this.animate('shake')
        this.$toast.open({
          message: this.$t('auth.validation.error'),
          type: 'is-danger'
        })
        return false
      }

      this.step = step;
    },
    async save() {
      if (this.$v.form.$invalid) {
        this.$v.form.$touch()
        this.animate('shake')
        this.$toast.open({
          message: this.$t('auth.validation.error'),
          type: 'is-danger'
        })
        return false
      }

      this.errors = false;
      this.isLoading = true;
      this.$store
        .dispatch("organizations/create", this.form)
        .then(res => {
          this.isLoading = false;
          this.$router.push(`/organizations/${res.slug}`);
        })
        .catch(error => {
          this.$toast.open({
            message: error.message,
            duration: 3000,
            type: "is-danger"
          });
          this.errors = true;
          this.isLoading = false;
        });
    },
    onAvatarUploadCompleted(value) {
      this.form.logo = value;
    }
  },
  head() {
    return {
      title: this.$t("component.organization.createNew")
    };
  }
};
</script>

<style lang="scss">
  @import "assets/styles/_utilities";
  @import "assets/styles/_animations";
  @import "~bulma-steps-component/bulma-steps.sass";

  .page-auth-name {
    .card {
      margin: 0 auto;
      max-width: 460px;
      transition: all 100ms ease;
      transition-delay: 100ms;
      text-align: center;
      border: none;
      box-shadow: $card-shadow;

      .steps {
        padding: 0.5rem 1rem 0.5rem;

        .steps-segment::after {
          transition: all 250ms ease;
        }
      }

      .card-teaser {
        img {
          display: inline-block;
          max-width: 150px;
          height: auto;
        }
      }
    }

    form {
      margin: 1em auto;
      padding: 1em;
      text-align: left;
      min-height: 400px;
      transition: all 100ms ease;
      transition-delay: 100ms;
    }

    .avatar-wrapper {
      width: 100%;
      justify-content: center;
      display: flex;
      padding: 2rem 0;
    }
    .user-avatar {
      $borderRadius: 50%;

      border-radius: $borderRadius;
      width: 120px;
      height: 120px;
      position: relative;
      display: inline-block;
      background-color: #fff;

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
  }
</style>
