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
    <!--<div class="field">
      <div class="control">
        <input
          class="input"
          id="form-tel"
          data-test="tel"
          maxlength="64"
          v-model.trim="form.tel"
          type="text"
          placeholder="Phone"
          :disabled="isLoading" />
      </div>
    </div>-->

    <table class="table is-striped is-fullwidth">
      <thead>
        <th>{{ $t('auth.settings.organizationStreet') }}</th>
        <th>{{ $t('auth.settings.organizationZipCode') }}</th>
        <th>{{ $t('auth.settings.organizationCountry') }}</th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="(address, index) in data.addresses"
          :key="address.street"
          :class="{'is-active': (index === editIndex)}">
          <td>
            {{ address.street }}
          </td>
          <td>
            {{ address.zipCode }} {{ address.city }}
          </td>
          <td>
            {{ address.country }}
          </td>
          <td>
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
          </td>
        </tr>
      </tbody>
    </table>
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
  import { required, minLength, maxLength } from "vuelidate/lib/validators";
  import { isEmpty } from "lodash";

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
          lat: null,
          lng: null
        },
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
          country: data.country || data.countryCode || null
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
        this.editIndex = index
        this.updateData(this.data.addresses[index])
      },
      validate () {
        if (this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          let output = Object.assign({}, this.data)
          const from = Object.assign({}, this.form)

          if (this.editIndex === null) {
            output.addresses.push(from)
          } else {
            output.addresses[this.editIndex] = from
          }

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
</style>
