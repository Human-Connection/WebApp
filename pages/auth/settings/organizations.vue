<template>
  <div class="organization-container" :class="{ 'is-loading': isLoading }">
    <div>
      <h3 class="title is-3">
        {{ $t('auth.settings.myOrganizations', 'My Organizations') }}
      </h3>
      <div class="organizations columns is-2 is-variable" style="flex-wrap: wrap;">
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
                <hc-button @click.prevent="edit(organization.slug)"
                           color="default"
                           size="medium"
                           type="button"
                           class="is-fullwidth"
                           :isLoading="isLoading">
                  <i class="fa fa-wrench"></i>
                </hc-button>
                <hc-button @click.prevent="trash(organization._id, index)"
                           color="danger"
                           size="medium"
                           type="button"
                           class="is-fullwidth"
                           :isLoading="isLoading">
                  <i class="fa fa-trash"></i>
                </hc-button>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="{ name: 'organizations-create' }" class="column organization">
          <div class="card has-text-centered" style="display: flex; justify-content: center; align-items: center;">
            <div class="card-content" style="padding: 1.5rem;">
              <i class="fa fa-plus fa-2x"></i>
              <h3 class="title is-6">{{ $t('component.organization.createNew') }}</h3>
            </div>
          </div>
        </nuxt-link>
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
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { isEmpty } from "lodash";

  export default {
    transition: 'NONE',
    data() {
      return {
        form: {
        },
        organizations: {},
        isLoading: true
      };
    },
    async mounted () {
      const organizations = await this.$api.service('organizations').find({
        query: {
          $limit: 50,
          userId: this.user._id
        }
      })
      this.organizations = organizations.data
      this.isLoading = false
    },
    methods: {
      edit(slug) {
        this.$router.push({name: 'organizations-settings', params: {slug: slug}})
      },
      trash(id, index) {
        this.$api.service('organizations').remove(id).then((res) => {
          this.organizations.splice(index, 1)
          console.log(res)
        })
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

  .organization {
    $padding: 1em !important;
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
      padding: $padding;
      align-self: stretch;
      width: 100%;
      height: 100%;
      text-align: center;

      &:hover {
        border-color: $grey;
      }
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

    .card-footer {
      margin-top: 20px;
      position: relative;
      z-index: 17;

      .under-construction {
        min-width: 49%;
      }

      .button {
        margin-top: 10px;
        font-size: 16px;
      }
    }
  }
</style>
