<template>
  <div class="organization-container">
    <div>
      <h3 class="title is-3">
        {{ $t('auth.settings.myOrganizations', 'My Organizations') }}
      </h3>
      <div class="organizations columns is-2 is-variable">
        <nuxt-link
            v-for="(organization, index) in organizations"
            :key="organization._id"
            :to="{ name: 'organizations-slug', params: { slug: organization.slug }}"
            class="column organization">
          <div class="card">
              <figure class="image">
                <img :src="organization.logo" :alt="organization.name">
              </figure>
            <div class="card-content" style="align-self: bottom;">
              <h3 class="title is-6">{{ organization.name }}</h3>
            </div>
            <div class="card-footer" style="align-self: bottom;">
                <hc-button @click.prevent="edit(organization._id)"
                           color="light"
                           size="medium"
                           type="button"
                           class="is-fullwidth"
                           :isLoading="isLoading">
                  <i class="fa fa-wrench"></i>
                </hc-button>
                <hc-button @click.prevent="trashModal(organization, index)"
                           color="light"
                           size="medium"
                           type="button"
                           class="is-fullwidth danger"
                           :isLoading="isLoading">
                  <i class="fa fa-trash"></i>
                </hc-button>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="{ name: 'organizations-create' }" class="column organization">
          <div class="card has-text-centered" style="display: flex; justify-content: center; align-items: center;">
            <div class="card-content" style="padding: 1.5rem; margin-bottom: 0;">
              <i class="fa fa-plus fa-2x"></i>
              <h3 class="title is-6">{{ $t('component.organization.createNew') }}</h3>
            </div>
          </div>
        </nuxt-link>
        <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
      </div>
    </div>
    <br>
    <!--<footer class="card-footer">
      <hc-button :isLoading="isLoading"
                  :disabled="true"
                  @click.prevent="save">
        <i class="fa fa-check"></i>
        &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
      </hc-button>
    </footer>-->
    <b-modal class="dialog" v-if="selectedOrganization" :active.sync="isDeleteModalActive" has-modal-card animation="zoom-in">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <h2 class="title is-3">{{ $t('button.delete' ) }}?</h2>
          <p v-html="$t('auth.settings.organizationDeleteModel', { name: selectedOrganization.name })"></p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-light"
                  @click="isDeleteModalActive = false">
            <hc-icon class="icon-left" icon="times" /> {{ $t('button.cancel' ) }}
          </button>
          <hc-button color="danger"
                     @click="trashFinal(selectedOrganization)"
                     :isLoading="isDeleting"
                     :disabled="isDeleting">
            <hc-icon class="icon-left" icon="trash" /> {{ $t('button.delete' ) }}
          </hc-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { isEmpty } from "lodash";

  export default {
    data() {
      return {
        form: {
        },
        organizations: [],
        isLoading: true,
        isDeleting: false,
        isDeleteModalActive: false,
        selectedOrganization: null,
        selectedOrganizationIndex: null
      };
    },
    mounted () {
      setTimeout(() => {
        if (this.user) {
          this.loadOrganizations()
        }
      }, 250)
    },
    watch: {
      user (user) {
        setTimeout(() => {
          if (!this.isLoading && !this.organizations.length) {
            this.loadOrganizations()
          }
        }, 150)
      }
    },
    methods: {
      async loadOrganizations () {
        this.isLoading = true
        const organizations = await this.$api.service('organizations').find({
          query: {
            $limit: 50,
            $sort: {
              createdAt: -1
            },
            userId: this.user._id
          }
        })
        this.organizations = organizations.data
        this.isLoading = false
      },
      edit(id) {
        this.$router.push({name: 'organizations-settings', query: { id }})
      },
      trashModal(organization, index) {
        this.selectedOrganization = organization
        this.selectedOrganizationIndex = index
        this.isDeleteModalActive = true
      },
      async trashFinal(organization) {
        try {
          const res = await this.$api.service('organizations').remove(organization._id)
          if (!isEmpty(res)) {
            this.organizations.splice(this.selectedOrganizationIndex, 1)
            this.$snackbar.open({
              message: this.$t('component.organization.deleted'),
              type: 'is-success'
            })
            this.isDeleteModalActive = false
          }
        } catch (err) {
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
          this.isDeleteModalActive = false
        }
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
  @import 'assets/styles/utilities';

  .organization-container {
    min-height: 200px;

    &.is-loading {
      position: relative !important;
    }
  }

  .organizations {
    flex-wrap: wrap;
    position: relative;
  }

  .organization {
    $padding: 1em;
    display: flex;
    padding-top: 1em;
    padding-bottom: 0;
    // align-items: bottom;
    justify-content: flex-start;
    flex-flow: row;

    @media (min-width: $tablet) {
      flex: none;
      width: 50% !important;
    }
    @media (min-width: $desktop) {
      flex: none;
      width: 33.3333% !important;
    }
    @media (min-width: $widescreen) {
      flex: none;
      width: 25% !important;
    }

    .card {
      box-shadow: none !important;
      border: 1px solid $grey-lighter;
      position: relative;
      padding: $padding;
      align-self: stretch;
      width: 100%;
      height: 100%;
      text-align: center;

      &:hover {
        border-color: $grey;
      }

      .image {
        margin-bottom: 0.5em;
        img {
          height: 80px;
          object-fit: contain;
        }
      }

      .card-content, .card-footer {
        padding: 0;
        float: left;
        width: 100%;
        text-align: center;
      }

      .card-content {
        margin-bottom: 3.5rem;
      }

      .card-footer {
        // margin: -1rem;
        // margin-top: 20px;
        padding: 0.5rem;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 17;
        align-self: flex-end;

        .under-construction {
          min-width: 49%;
        }

        .button {
          // margin-top: 10px;
          font-size: 16px;
          background-color: transparent;
          border: 1px solid transparen;
          color: $grey-light;

          transition: all 25ms ease;

          &:hover {
            background-color: $white;
            border-color: darken($white, 15%);
            color: $grey-dark;
          }

          &.danger:hover {
            background-color: darken($danger, 5%);
            border-color: darken($danger, 15%);
            color: $white;
          }
        }
      }
    }

  }
</style>
