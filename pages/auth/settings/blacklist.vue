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
         :user="user"
         />
      </hc-box>
  </div>
</template>

<script>
import Author from '~/components/Author/Author.vue'
import Box from '~/components/Global/Layout/Box/Box.vue'
import { mapGetters } from 'vuex'

  export default {
    components: {
      'author': Author,
      'hc-box': Box
    },
    data() {
      return {
        blacklistedUsers: [],
      }
    },
    computed: {
      ...mapGetters({
        loggedInUser: 'auth/user',
        userSettings: 'feathers-vuex-usersettings/current',
        isLoading: 'feathers-vuex-usersettings/isPending'
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
    }
  };
</script>

<style lang="scss" scoped>
</style>
