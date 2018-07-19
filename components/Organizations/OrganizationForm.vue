<template>
  <div v-if="organization">
    <div class="info-text columns">
      <div class="column">
        <slot name="header"></slot>
      </div>
      <div class="column is-3 settings-left">
        <slot name="aside"></slot>
      </div>
    </div>
    <hr>
    <form @submit.prevent="$refs.form.validate()">
      <div class="columns">
        <div class="column">
          <component
            ref="form"
            :data="formData"
            @validate="onValidation"
            @deleteItem="showDeleteModal"
            :hideButton="true"
            :autoFocus="false"
            :canEnable="canEnable"
            :is="formComponent" />
        </div>
      </div>
      <footer class="card-footer">
        <hc-button
          :isLoading="isLoading"
          :disabled="isLoading"
          @click.prevent="$refs.form.validate()">
          <i class="fa fa-check"></i>
          &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
        </hc-button>
      </footer>
    </form>

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
                     @click.prevent="del">
            <hc-icon class="icon-left" icon="trash" /> {{ $t('button.delete' ) }}
          </hc-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'organization-form',
    props: {
      formComponent: {
        type: Object,
        required: true
      },
      formAttributes: {
        type: Object,
        required: true
      },
      organization: {
        type: Object,
        required: true
      },
      user: {
        type: Object,
        required: true
      },
      isLoading: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        formData: {},
        deleteModalActive: false,
        deleteModalVar: null,
        deleteRessource: null,
        deleteIndex: null
      }
    },
    watch: {
      organization: {
        handler (organization) {
          this.updateFormData(organization)
        },
        deep: true
      }
    },
    created () {
      this.updateFormData(this.organization)
    },
    computed: {
      canEnable () {
        // owner (if reviewed), moderator, admin
        return ['admin', 'moderator'].includes(this.user.role) || this.organization.reviewedBy
      }
    },
    methods: {
      onValidation (result) {
        if (result) {
          let formData = Object.assign(this.formData, result)
          this.$parent.$emit('save', formData)
        } else {
          this.$toast.open({
            message: this.$t('auth.validation.error'),
              type: 'is-danger'
            })
          this.$parent.$emit('error')
        }
      },
      updateFormData (organization) {
        Object.keys(this.formAttributes).forEach(key => {
          Vue.set(
            this.formData,
            key,
            organization[key] !== undefined ?
              organization[key] : this.formAttributes[key]
          )
        })
      },
      showDeleteModal ({ ressource, index, name }) {
        this.deleteRessource = ressource
        this.deleteIndex = index
        this.deleteModalVar = name
        this.deleteModalActive = true
      },
      del () {
        let output = Object.assign({}, this.formData)
        output[this.deleteRessource].splice(this.deleteIndex, 1)
        this.onValidation(output)
        this.editIndex = null
        this.closeDeleteModal()
      },
      closeDeleteModal () {
        this.deleteModalActive = false
        setTimeout(() => {
          this.deleteRessource = null
          this.deleteIndex = null
          this.deleteModalVar = null
        }, 350)
      }
    }
  };
</script>

<style lang="scss" scoped>
  .settings-left {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }
</style>
