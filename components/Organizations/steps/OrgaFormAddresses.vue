<template>
  <div>
    <!--<hc-map :places="places" :zoom="zoom" :center="center" height="350px" :token="$env.MAPBOX_TOKEN" />-->
    <div class="field">
      <div class="control">
        <no-ssr>
          <places
            class="input"
            v-model="form.street"
            :placeholder="$t('auth.settings.organizationStreet')"
            :options="{
              type: 'address',
              templates: {
                value: (suggestion) => suggestion.name
              }
            }"
            @change="onAddress"
            />
        </no-ssr>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field is-required" ref="zipCode">
          <div class="control">
            <input
              class="input"
              id="form-zip-code"
              data-test="zip-code"
              maxlength="64"
              v-model.trim="form.zipCode"
              @blur="$v.form.zipCode.$touch()"
              type="text"
              :placeholder="$t('auth.settings.organizationZipCode')"
              :disabled="isLoading" />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field is-required" ref="city">
          <div class="control">
            <input
              class="input"
              id="form-city"
              data-test="city"
              maxlength="64"
              v-model.trim="form.city"
              @blur="$v.form.city.$touch()"
              type="text"
              :placeholder="$t('auth.settings.organizationCity')"
              :disabled="isLoading" />
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field is-required" ref="email">
          <div class="control">
            <input
              class="input"
              id="form-email"
              data-test="email"
              maxlength="64"
              v-model.trim="form.email"
              @blur="$v.form.email.$touch()"
              type="text"
              :placeholder="$t('auth.settings.email')"
              :disabled="isLoading" />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field is-required" ref="phone">
          <div class="control">
            <input
              class="input"
              id="phone"
              data-test="phone"
              maxlength="64"
              v-model.trim="form.phone"
              @blur="$v.form.phone.$touch()"
              type="text"
              :placeholder="$t('auth.settings.phone')"
              :disabled="isLoading" />
          </div>
        </div>
      </div>
    </div>
    <div class="address-list">
      <div class="address-item"
          v-for="(address, index) in data.addresses"
          :key="index">
        <div class="address-item-inner"
          :class="{'is-active': (index === editIndex)}">
          {{ address.street }}<br />
          {{ address.zipCode }} {{ address.city }}<br />
          {{ countryByCode(address.country) }}
          <template v-if="address.email">
            <br /><hc-icon icon="envelope" class="address-icon" />
            {{ address.email }}
          </template>
          <template v-if="address.phone">
            <br /><hc-icon icon="phone" class="address-icon" />
            {{ address.phone }}
          </template>
          <div class="field has-margin-top-small">
            <div class="control">
              <input type="radio" :id="`primary-address-${index}`"
                v-model="primaryAddressIndex" :value="index">
              <label :for="`primary-address-${index}`">{{ $t('component.organization.primary') }}</label>
            </div>
          </div>
          <div class="address-item-actions">
            <a
              :title="$t('button.edit')"
              @click="edit(index)"
              class="btn-edit">
              <hc-icon icon="pencil" />
            </a>&nbsp;&nbsp;
            <a
              :title="$t('button.delete')"
              @click="showDeleteModal(index)"
              class="btn-delete">
              <hc-icon icon="trash" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <br />
    <slot v-if="!hideButton">
      <hc-button
        color="primary"
        @click.prevent="validate()"
        size="medium"
        type="button"
        class="is-fullwidth"
        :isLoading="isLoading"
        :disabled="isLoading">
        {{ $t('button.next') }} <hc-icon class="icon-right" icon="angle-right" />
      </hc-button>
    </slot>
    <b-modal v-if="deleteIndex !== null" :active.sync="deleteModalActive" has-modal-card animation="zoom-in">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <h2 class="title is-3">{{ $t('button.delete' ) }}?</h2>
          <p v-html="$t('auth.settings.organizationDeleteModel', { name: deleteModalVar })"></p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-light"
                  @click.prevent="closeDeleteModal">
            <hc-icon class="icon-left" icon="times" /> {{ $t('button.cancel' ) }}
          </button>
          <hc-button color="danger"
                     @click.prevent="del(deleteIndex)">
            <hc-icon class="icon-left" icon="trash" /> {{ $t('button.delete' ) }}
          </hc-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { validationMixin } from "vuelidate";
  import { required, minLength, maxLength, email } from "vuelidate/lib/validators";
  import { isEmpty } from "lodash";

  const countries = require("i18n-iso-countries");
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
  countries.registerLocale(require("i18n-iso-countries/langs/de.json"));

  const Places = process.client ? require('vue-places').default : null
  const Map = () => import('~/components/Map/Map.vue')

  const generatePlaces = (entity) => {
    let places = []
    if (isEmpty(entity.addresses)) {
      return places
    }
    entity.addresses.forEach(address => {
      places.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [address.lng, address.lat]
        },
        properties: {
          title: entity.name,
          description: entity.description
        }
      })
    })
    return places
  }

  export default {
    mixins: [validationMixin],
    components: {
      'hc-map': Map,
      Places
    },
    props: {
      data: {
        type: Object
      },
      hideButton: {
        type: Boolean,
        default: false
      }
    },
    name: 'orga-form-addresses',
    data () {
      return {
        form: {
          street: null,
          zipCode: null,
          city: null,
          country: null,
          email: null,
          phone: null,
          lat: null,
          lng: null
        },
        primaryAddressIndex: null,
        deleteModalActive: false,
        deleteModalVar: null,
        deleteIndex: null,
        editIndex: null,
        isLoading: false,
        places: generatePlaces(this.data),
        zoom: 3,
        center: {
          lat: 49.890860,
          lng: 10.327148
        }
      }
    },
    watch: {
      data (data) {
        this.primaryAddressIndex = data.primaryAddressIndex
      },
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.primaryAddressIndex = this.data.primaryAddressIndex
      })
    },
    methods: {
      countryByCode (code) {
        return countries.getName(code, this.$i18n.locale())
      },
      onAddress (data) {
        if (!data || !data.latlng) {
          return
        }
        this.updateData(data)
        this.$v.form.street.$touch()
      },
      updateData (data) {
        this.form = Object.assign(this.form, {
          street: data.name || data.street || null,
          zipCode: data.postcode || data.zipCode || null,
          city: data.city || null,
          email: data.email || null,
          phone: data.phone || null,
          country: data.countryCode || data.country || null
        })
        try {
          this.form = Object.assign(this.form, {
            lat: !isEmpty(data.latlng) ? data.latlng.lat : data.lat,
            lng: !isEmpty(data.latlng) ? data.latlng.lng : data.lng
          })
        } catch (err) {}
      },
      showDeleteModal (index) {
        this.deleteIndex = index
        this.deleteModalVar = this.data.addresses[index].street
        this.deleteModalActive = true
      },
      del (index) {
        let output = Object.assign({}, this.data)
        output.addresses.splice(index, 1)
        this.$emit('validate', output)
        this.editIndex = null
        this.closeDeleteModal()
      },
      closeDeleteModal () {
        this.deleteModalActive = false
        setTimeout(() => {
          this.deleteIndex = null
          this.deleteModalVar = null
        }, 350)
      },
      edit (index) {
        if (this.editIndex !== null && index === this.editIndex) {
          this.editIndex = null
          this.updateData({})
        } else {
          this.editIndex = index
          this.updateData(this.data.addresses[index])
        }
      },
      validate () {
        const checkDirty = ['city', 'email', 'phone', 'street', 'zipCode']
        const dirty = checkDirty.some(key => this.$v.form[key].$dirty)
        if (dirty && this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          let output = Object.assign({}, this.data)
          if (dirty) {
            const form = Object.assign({}, this.form)
            if (this.editIndex === null) {
              output.addresses.push(form)
            } else {
              output.addresses[this.editIndex] = form
            }
          }

          output.primaryAddressIndex = this.primaryAddressIndex

          this.$emit('validate', output)
          this.editIndex = null

          // reset form values to null
          this.updateData({})
        }
      }
    },
    validations() {
      return {
        form: {
          street: {
            required
          },
          zipCode: {
            required
          },
          city: {
            required
          },
          email: {
            email
          },
          phone: {
            maxLength: maxLength(64)
          }
        }
      };
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  tr.is-active {
    font-weight: bold !important;
    background-color: $white-ter !important;
  }

  .btn-edit {
    color: $black-ter;
  }
  .btn-delete {
    color: $red;
  }

  .address-item-inner {
    background-color: $white-bis;
    margin: $margin 0;
    padding: $padding;
    border-bottom: 3px solid $white-ter;
    line-height: 1.5;

    &.is-active {
      border-color: $primary;
    }
  }

  .address-icon {
    color: $grey-light;
    width: 20px;
    position: relative;
    top: -1px;
  }

  .address-item-actions {
    margin-top: $margin;
  }
</style>
