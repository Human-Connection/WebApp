<template>
  <div v-if="organization">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('component.organization.generalData', 'Organizationdata') }}
      </h2>
      <p class="subtitle is-6">{{ $t('component.organization.settingsWelcome') }}</p>
    </div>
    <hr>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label" for="form-username">{{ $t('component.organization.name', 'Name of the Organization:') }}</label>
          <div class="control has-icons-left" id="form-username">
            <input
                    class="input"
                    type="text"
                    placeholder="Anonymus"
                    v-model="form.name">
            <span class="icon is-small is-left">
              <i class="fa fa-home"></i>
            </span>
          </div>
        </div>
        <div class="field">
          <label class="label" for="form-description">{{ $t('component.organization.orgaDescriptionPlaceholder', 'describe the organization') }}</label>
          <hc-editor
                  identifier="description"
                  id="form-description"
                  data-test="description"
                  v-model.trim="form.description"
                  :class="{ 'is-danger': $v.form.description.$error }"
                  @blur="$v.form.description.$touch()"
                  :loading="isLoading"></hc-editor>
        </div>
        <div class="field">
          <div class="control">
            <label class="label is-required" for="form-orgaLanguages">{{ $t('component.organization.organizationLanguageSelection') }}</label>
            <div class="block" id="form-orgaLanguages">
              <b-radio v-model="form.orgaLanguage"
                       @input="$v.form.orgaLanguage.$touch()"
                       native-value="de">
                Deutsch
              </b-radio>
              <b-radio v-model="form.orgaLanguage"
                       @input="$v.form.orgaLanguage.$touch()"
                       native-value="en">
                English
              </b-radio>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="is-normal">
            <label class="label is-required">{{ $t('component.organization.type') }}</label>
          </div>
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
            </div>
          </div>
        </div>
        <br />
        <div class="field">
          <label class="label is-required">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
          <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
        </div>
      </div>
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
  import { isEmpty } from "lodash";
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'

  export default {
    mixins: [validationMixin],
    components: {
      'categories-select': CategoriesSelect
    },
    data() {
      return {
        form: {
          name: '',
          description: '',
          type: '',
          categoryIds: [],
          orgaLanguage: ''
        },
        organization: null,
        isLoading: false
      };
    },
    validations () {
      let rules = {
        description: {
          minLength: minLength(10),
          maxLength: maxLength(300)
        },
        orgaLanguage: {
          required
        }
      }

      return {
        form: rules
      }
    },
    watch: {
      'this.$parent.$attrs.organization': (organization) => {
        // get current organization from parent view
        this.organization = this.organization
      }
    },
    mounted() {
      this.$nextTick(() => {
        // get current organization from parent view
        this.organization = this.$parent.$attrs.organization

        this.form = Object.assign(this.form, {
          name: this.organization.name,
          description: this.organization.description,
          type: this.organization.type,
          orgaLanguage: this.organization.language,
          categoryIds: this.organization.categoryIds
        })
      })
    },
    methods: {
      async save() {
        this.isLoading = true;
        try {
          let data = Object.assign({_id: this.organization._id}, this.form)
          const res = await this.$store.dispatch("organizations/patch", data)

          this.$snackbar.open({
            message: this.$t('auth.settings.saveSettingsSuccess'),
            type: "is-success"
          });

          // update the organization on the parent component
          this.$parent.$emit('change', res)
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          });
        }
        this.isLoading = false;
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

