<template>
  <div class="info-text">
    <h2 class="title is-3">
      {{ $t('auth.settings.blacklist') }}
    </h2>
    <p class="subtitle is-6">{{ $t('auth.settings.blacklistSubtitle') }}</p>
    <hc-box :isLoading="isLoading">
      <author
       v-for="(user, index) in blacklistedUsers"
       :key="user._id"
       :user="user">
        <div class="media-right">
          <hc-block-button :foreignEntity="user" :isFollowing="false"/>
        </div>
      </author>
    </hc-box>
  </div>
</template>

<script>
import Author from '~/components/Author/Author.vue'
import Box from '~/components/Global/Layout/Box/Box.vue'
import BlockButton from '~/components/Global/Elements/BlockButton/BlockButton'
import { mapGetters } from 'vuex'

  export default {
    components: {
      'hc-block-button': BlockButton,
      'author': Author,
      'hc-box': Box
    },
    data() {
      return {
        blacklistedUsers: [],
        isLoading: true
      }
    },
    computed: {
      ...mapGetters({
        loggedInUser: 'auth/user',
        userSettings: 'feathers-vuex-usersettings/current'
      })
    },
    async mounted(){
      await this.$store.dispatch('feathers-vuex-usersettings/loadCurrent', this.loggedInUser)
      const { blacklist = [] } = this.userSettings || {}
      const res = await this.$store.dispatch('feathers-vuex-users/find', {
        query: {
          _id: { $in: blacklist },
        }
      })
      this.blacklistedUsers = res.data
      this.isLoading = false
    }
  };
</script>

<style lang="scss" scoped>
</style>
