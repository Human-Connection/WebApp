<template>
  <div>
    <div class="columns">
      <div class="column is-narrow">
        <div class="field is-required">
          <div class="control"
            :class="{ 'has-error': $v.form.type.$error }">
            <div class="select orga-user-role">
              <select v-model="form.type"
                @blur="$v.form.type.$touch()">
                <option
                  disabled
                  selected
                  :value="null">
                  {{ $t('auth.settings.organizationChannelsTypePlaceholder') }}
                </option>
                <option
                  v-for="type in types"
                  :key="type"
                  :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column expand">
        <div class="field is-required">
          <div class="control has-icons-left"
            :class="{ 'has-error': $v.form.name.$error }">
            <input class="input"
              type="text"
              v-model="form.name"
              @blur="$v.form.name.$touch()"
              :placeholder="$t('auth.settings.organizationChannelsNamePlaceholder')"
              :disabled="isLoading" />
            <span class="icon is-small is-left">
              <hc-icon icon="at" />
            </span>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <hc-button>{{ $t('button.add') }}</hc-button>
      </div>
    </div>
    <div class="user-list">
      <no-ssr>
        <v2-table :data="tableRows" :stripe="true">
          <v2-table-column label="Type" prop="type" align="left" width="130">></v2-table-column>
          <v2-table-column label="Name" prop="name" align="left">
            <template slot-scope="row">
              <hc-icon icon="at" /> {{ row.name }}
            </template>
          </v2-table-column>
          <v2-table-column align="right" width="100">
            <template slot-scope="row">
              <a
                :title="$t('button.edit')"
                @click="edit(row.index)"
                class="btn-edit">
                <hc-icon icon="pencil" />
              </a>&nbsp;&nbsp;
              <a
                :title="$t('button.delete')"
                @click="$emit('deleteItem', {
                  ressource: 'channels',
                  index: row.index,
                  name: row.name
                })"
                class="btn-delete">
                <hc-icon icon="trash" />
              </a>
            </template>
          </v2-table-column>
        </v2-table>
      </no-ssr>
    </div>
  </div>
</template>

<script>
  import { collections } from 'human-connection-modules'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength, email } from "vuelidate/lib/validators"
  import { isEmpty } from "lodash"

  export default {
    name: 'orga-form-channels',
    mixins: [validationMixin],
    props: {
      data: {
        type: Object
      }
    },
    data () {
      return {
        form: {
          name: null,
          type: null
        },
        types: collections.socialChannels.names,
        editIndex: null,
        isLoading: false
      }
    },
    computed: {
      tableRows () {
        return this.data.channels.map((channel, index) => {
          channel.index = index
          return channel
        })
      }
    },
    watch: {
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      }
    },
    methods: {
      itemSelected (data) {
        const channel = data.item
        this.form = Object.assign(this.form, {
          name: channel.name || null,
          type: channel.type || null
        })
      },
      updateData (data) {
        this.form = Object.assign(this.form, {
          name: data.name || null,
          type: data.type || null
        })
      },
      edit (index) {
        if (this.editIndex !== null && index === this.editIndex) {
          this.editIndex = null
          this.updateData({})
        } else {
          this.editIndex = index
          this.updateData(this.data.channels[index])
        }
      },
      validate () {
        const checkDirty = ['name', 'type']
        const dirty = checkDirty.some(key => this.$v.form[key].$dirty)
        if (dirty && this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          let output = Object.assign({}, this.data)
          if (dirty) {
            const form = Object.assign({}, this.form)
            console.log('form', form.name)
            if (this.editIndex === null) {
              output.channels.push(form)
            } else {
              output.channels[this.editIndex] = form
            }
          }

          this.$emit('validate', output)
          this.editIndex = null

          // reset form values to null
          this.updateData({})
          this.$v.$reset()
        }
      }
    },
    validations() {
      return {
        form: {
          name: {
            required
          },
          type: {
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

  .orga-user-role {
    height: 2.6em;

    & > select {
      height: 2.6em;
    }
  }
</style>
