<template>
  <div>
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
    <div class="field">
      <div class="control has-icons-right"
            :class="{ 'has-error': $v.form.url.$error }">
        <label class="label is-required" for="form-url">{{ $t('component.organization.website') }}</label>
        <input id="form-url"
                class="input "
                type="text"
                placeholder="https://"
                @blur="enhanceURL"
                v-model="form.url">
      </div>
      <p :class="{ 'is-hidden': !$v.form.url.$error }" class="help is-danger">{{ $t('auth.validation.error') }}</p>
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
                <option value="other">{{ $t('component.organization.types.other') }}</option>
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
  import { required, minLength, maxLength, url } from "vuelidate/lib/validators";

  const linkify = require('linkifyjs')

  export default {
    mixins: [validationMixin],
    props: {
      data: {
        type: Object
      },
      hideButton: {
        type: Boolean,
        default: false
      }
    },
    name: 'orga-form-step-2',
    data () {
      return {
        form: {
          description: '',
          url: '',
          type: null
        },
        isLoading: false
      }
    },
    watch: {
      data (data) {
        this.updateData(data)
      },
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.updateData(this.data)
      })
    },
    methods: {
      enhanceURL () {
        const urls = linkify.find(this.form.url || '', 'url')
        if (urls.length) {
          this.form.url = urls.pop().href
        }
      },
      updateData (data) {
        this.form = Object.assign(this.form, {
          description: data.description,
          url: data.url,
          type: data.type
        })
      },
      validate () {
        this.enhanceURL()

        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          this.$emit('validate', this.form)
        }
      }
    },
    validations() {
      return {
        form: {
          description: {
            required,
            minLength: minLength(10)
          },
          url: {
            required,
            url
          },
          type: {
            required
          },
        }
      };
    }
  }
</script>
