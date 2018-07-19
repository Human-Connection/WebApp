<template>
  <div>
    <div class="columns">
      <div class="column expand">
        <div class="field is-required" ref="id">
          <div class="control">
            <div v-show="!form.id"
              class="orga-user-search-container">
              <input class="input"
                data-test="id"
                type="text"
                v-model="searchString"
                :placeholder="$t('component.search.user')"
                ref="search"
                @focus="searchFocus = true"
                v-click-outside="hideSearch"
                :disabled="isLoading" />
              <search :search-string="searchString" v-show="showSearch"
                class="orga-user-search"
                @itemselected="itemSelected"></search>
            </div>
            <hc-fake-input v-show="form.id"
              @deleteItem="startNewSearch">
              <hc-avatar :user="form"
                :showName="true" :size="26"></hc-avatar>
            </hc-fake-input>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="field is-required" ref="role">
          <div class="control">
            <div class="select orga-user-role">
              <select v-model="form.role">
                <option
                  v-for="role in roles"
                  :key="role"
                  :value="role">
                  {{ role }}
                </option>
              </select>
            </div>
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
          <v2-table-column label="Name" prop="name" align="left" width="300">
            <template slot-scope="row">
              <a v-if="row.slug" :href="`/profile/${row.slug}`" target="_blank" style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
                <hc-avatar :user="row"
                  :showOnlineStatus="true"
                  :showName="true"></hc-avatar>
              </a>
              <div v-else style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
                <hc-avatar :user="row"
                  :showOnlineStatus="true"
                  :showName="true"></hc-avatar>
              </div>
            </template>
          </v2-table-column>
          <v2-table-column label="Role" prop="role" align="left"></v2-table-column>
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
        searchString: '',
        searchFocus: false,
        form: {
          name: null,
          avatar: null,
          slug: null,
          id: null,
          role: 'editor'
        },
        roles: [
          'editor',
          'admin'
        ],
        editIndex: null,
        isLoading: false
      }
    },
    computed: {
      tableRows () {
        return this.data.users.map((user, index) => {
          user.index = index
          return user
        })
      },
      showSearch () {
        return this.searchFocus && this.searchString
      }
    },
    watch: {
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      }
    },
    methods: {
      hideSearch () {
        this.searchFocus = false
      },
      itemSelected (data) {
        const user = data.item
        this.form = Object.assign(this.form, {
          id: user._id || null,
          avatar: user.avatar || null,
          name: user.name || null,
          slug: user.slug || null
        })
      },
      startNewSearch () {
        this.form = Object.assign(this.form, {
          id: null,
          avatar: null,
          name: null,
          slug: null
        })
        this.$nextTick(() => {
          this.$refs.search.focus()
        })
      },
      updateData (data) {
        this.form = Object.assign(this.form, {
          id: data.id || null,
          avatar: data.avatar || null,
          name: data.name || null,
          slug: data.slug || null,
          role: data.role || 'editor'
        })
      },
      edit (index) {
        if (this.editIndex !== null && index === this.editIndex) {
          this.editIndex = null
          this.updateData({})
        } else {
          this.editIndex = index
          this.updateData(this.data.users[index])
        }
      },
      validate () {
        if (this.$v.form.$dirty && this.$v.form.$invalid) {
          this.$v.form.$touch()
          this.$emit('validate', false)
        } else {
          // return validated form data
          let output = Object.assign({}, this.data)
          const form = Object.assign({}, this.form)
          if (this.editIndex === null) {
            output.users.push(form)
          } else {
            output.users[this.editIndex] = form
          }
          this.searchString = ''

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
          id: {
            required
          },
          role: {
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

  .orga-user-search-container {
    position: relative;

    .orga-user-search {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      top: 100%;
      z-index: 100;
    }
  }

  .orga-user-role {
    height: 2.6em;

    & > select {
      height: 2.6em;
    }
  }
</style>
