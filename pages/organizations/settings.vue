<template>
  <section class="container organization-settings">
    <div class="columns">
      <div class="column is-9">
        <h2 class="title is-2 is-marginless">{{ $t('component.organization.general', 'Organization settings') }}</h2>
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <nuxt-link :to="{ name: 'auth-settings'}">{{ $t('auth.account.settings') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'auth-settings-organizations'}">{{ $t('auth.settings.organizations', 'My Organizations') }}</nuxt-link>
            </li>
            <li class="is-active"><a href="#" aria-current="page">{{ organization.name }}</a></li>
          </ul>
        </nav>
      </div>
      <div class="column has-text-right" style="display: flex; justify-content: flex-end; align-items: flex-end;">
        <hc-button :to="`/organizations/${organization.slug}`"
                   type="link"
                   target="_blank"
                   color="white">
          {{ $t('component.organization.goToProfile')}} <hc-icon class="icon-right" icon="angle-right" />
        </hc-button>
      </div>
    </div>
    <organization-review-banner v-if="user" :user="user" :organization="organization" @review="updateOrganization" />
    <div class="columns">
      <div class="column is-one-third menu">
        <aside>
          <p class="menu-label">
            {{ $t('component.organization.generalDetails', 'General details') }}
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link :to="{ name: 'organizations-settings', query: { id: organization._id } }">{{ $t('component.organization.stepBasics', 'Basics') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'organizations-settings-details', query: { id: organization._id } }">{{ $t('component.organization.stepDetails', 'Details') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'organizations-settings-categories', query: { id: organization._id } }">{{ $t('component.organization.stepCategories', 'Categories') }}</nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'organizations-settings-addresses', query: { id: organization._id } }">{{ $t('auth.settings.organizationAddresses', 'Addresses') }}</nuxt-link>
            </li>
          </ul>
          <p class="menu-label">
            {{ $t('component.projects.label') }}
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link :to="{ name: 'organizations-settings-projects', query: { id: organization._id } }">{{ $t('component.projects.label', 'Projects') }}</nuxt-link>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <transition name="slide-up" appear>
          <nuxt :organization="organization"
                :user="user"
                :class="classes"
                @change="updateOrganization"
                @error="onError"
                class="settings-content"/>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
  import animatable from '~/components/mixins/animatable'
  import OrganizationReviewBanner from '~/components/Organizations/OrganizationReviewBanner.vue'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [animatable],
    components: {
      OrganizationReviewBanner
    },
    head () {
      return {
        title: this.$t('auth.account.settings', 'Settings')
      }
    },
    async asyncData ({app, query, store, error, redirect}) {
      try {
        const organization = await app.$api.service('organizations').get(query.id)
        const user = store.getters['auth/user']
        if (organization.userId !== user._id && ['admin', 'moderator'].includes(user.role) === false) {
          error({ statusCode: 403 })
        }

        return {
          organization
        }
      } catch (err) {
        if (err.code === 404) {
          // redirect user to its organization list if it was not found
          redirect({name: 'auth-settings-organizations'})
        } else {
          error({statusCode: err.code || 500, message: err.message})
          return {}
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      canEdit () {
        // owner, moderator, admin
        return this.organization.userId === this.user._id || ['admin', 'moderator'].includes(this.user.role) === true
      },
      canEnable () {
        // owner (if reviewed), moderator, admin
        return ['admin', 'moderator'].includes(this.user.role) === true || this.organization.reviewedBy
      }
    },
    methods: {
      onError () {
        this.animate('shake')
      },
      updateOrganization (organization) {
        // update organization after it was saved by child view
        this.organization = Object.assign(this.organization, organization)
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/settings/main";
</style>
