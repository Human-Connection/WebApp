<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="field is-required" ref="id">
          <div class="control">
            <input
              class="input"
              data-test="id"
              type="text"
              v-model="searchString"
              :disabled="isLoading" />
            <search :search-string="searchString"
              @itemselected="itemSelected"></search>
          </div>
        </div>
      </div>
    </div>
    <div class="user-list">
      <v2-table :data="tableRows" :stripe="true">
        <v2-table-column label="Name" prop="name" align="left" width="300">
          <template slot-scope="row">
            <a v-if="row.slug" :href="`/profile/${row.slug}`" target="_blank" style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
              <hc-avatar :showOnlineStatus="true" :user="row" style="display: inline-block; float: left;" />&nbsp;<span style="display: inline-block; padding: 5px 10px;">{{ row.name }}</span>
            </a>
            <div v-else style="white-space: nowrap;" :class="{'link': !!row.slug}" class="cell-name">
              <hc-avatar :showOnlineStatus="true" :user="row" style="display: inline-block; float: left;" />&nbsp;<span style="display: inline-block; padding: 5px 10px;">{{ row.name }}</span>
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
              @click="showDeleteModal(row.index)"
              class="btn-delete">
              <hc-icon icon="trash" />
            </a>
          </template>
        </v2-table-column>
      </v2-table>
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
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength, email } from "vuelidate/lib/validators"
  import { isEmpty } from "lodash"
  import Search from '~/components/Mentions/Search.vue'

  export default {
    name: 'orga-form-users',
    mixins: [validationMixin],
    components: {
      Search
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
    data () {
      return {
        searchString: '',
        form: {
          name: null,
          id: null,
          role: 'editor'
        },
        deleteModalActive: false,
        deleteModalVar: null,
        deleteIndex: null,
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
      }
    },
    watch: {
      isLoading (isLoading) {
        this.$emit('isLoading', isLoading)
      }
    },
    methods: {
      itemSelected (user) {
        this.updateData(user)
      },
      updateData (data) {
        this.form = Object.assign(this.form, {
          id: data.id || null,
          name: data.name || null,
          role: data.role || 'editor'
        })
      },
      showDeleteModal (index) {
        this.deleteIndex = index
        this.deleteModalVar = this.data.users[index].name
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
</style>
