<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="field" ref="title">
          <label class="label is-required" for="form-title">{{ $t('component.admin.labelTitle') }}</label>
          <div class="control" :class="{ 'has-error': v.form[language].title.$error }">
            <input
              class="input"
              id="form-title"
              data-test="title"
              :class="{ 'is-danger': v.form[language].title.$error }"
              maxlength="64"
              v-model.trim="form.title"
              @blur="v.form[language].title.$touch"
              type="text"
              :placeholder="$t('component.admin.labelTitle')"
              :disabled="isLoading">
          </div>
          <p :class="{ 'is-hidden': !v.form[language].title.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorTitle') }}</p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label is-required" for="form-key">{{ $t('component.admin.labelKey') }}</label>
          <div class="control" :class="{ 'has-error': v.form[language].key.$error }">
            <input
              class="input"
              id="form-key"
              data-test="key"
              :class="{ 'is-danger': v.form[language].key.$error }"
              maxlength="64"
              v-model.trim="form.key"
              @blur="v.form[language].key.$touch"
              type="text"
              :placeholder="$t('component.admin.labelKey')"
              :disabled="isLoading || isProtected(form.type)">
          </div>
          <p :class="{ 'is-hidden': !v.form[language].key.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorTitle') }}</p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
        <div class="field">
          <div class="is-normal">
            <label class="label is-required">{{ $t('component.admin.labelType') }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="form.type" :disabled="true">
                    <option value="page" selected>{{ $t('component.admin.pageTypePage') }}</option>
                    <option value="imprint">{{ $t('component.admin.pageTypeImprint') }}</option>
                    <option value="dataPrivacy">{{ $t('component.admin.pageTypeDataPrivacy') }}</option>
                    <option value="termsAndConditions">{{ $t('component.admin.pageTypeTermsAndConditions') }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label is-required" for="form-content">{{ $t('component.admin.labelContent') }}</label>
          <div class="control" :class="{ 'has-error': v.form[language].content.$error }">
            <hc-editor
              identifier="content"
              id="form-content"
              data-test="content"
              v-model.trim="form.content"
              :class="{ 'is-danger': v.form[language].content.$error }"
              @blur="v.form[language].content.$touch()"
              :loading="isLoading"
              :editorOptions="editorOptions"></hc-editor>
          </div>
          <p :class="{ 'is-hidden': !v.form[language].content.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorContent') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength } from "vuelidate/lib/validators"

  export default {
    mixins: [validationMixin],
    props: {
      data: {
        requried: true,
        type: Object
      },
      language: {
        type: String
      },
      type: {
        type: String
      },
      formKey: {
        type: String
      },
      v: {
        type: Object
      }
    },
    name: 'page-form',
    data () {
      return {
        form: this.data,
        isLoading: false,
        editorOptions: {
          placeholder: this.$t('component.admin.labelContent')
        }
      }
    },
    watch: {
      data (data) {
        this.updateData(data)
      },
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      },
      v (v) {
        this.$v = v
        this.$v.$touch()
      },
      'form.type' (type) {
        if (this.isProtected(type)) {
          this.form.key = type
        }
      },
      'form.key' (key) {
        this.$emit('keyChanged', key, this.language)
      }
    },
    mounted () {
      this.$nextTick(() => {
        // this.resetData()
        this.updateData(this.data)
      })
    },
    methods: {
      updateData (data) {
        this.form = data
        this.form.type = this.type
        this.form.key = this.formKey
        this.form.language = this.language

        if (this.isProtected(this.form.type)) {
          this.form.key = this.form.type
        }
      },
      isProtected (type) {
        return ['imprint','termsAndConditions','dataPrivacy'].includes(type)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
