<template>
  <div class="info-text">
    <h2 class="title is-3">
      {{ $t('auth.settings.blacklist') }}
    </h2>
    <p class="subtitle is-6">{{ $t('auth.settings.blacklistSubtitle') }}</p>
    <author
       v-for="(user, index) in blacklistedUsers"
       :key="user._id"
       :user="user"
       />
  </div>
</template>

<script>
import Author from '~/components/Author/Author.vue'
import { mapGetters } from 'vuex'

  export default {
    components: {
      'author': Author
    },
    data() {
      return {
        blacklistedUsers: [],
      }
    },
    computed: {
      ...mapGetters({
        loggedInUser: 'auth/user',
        userSettings: 'feathers-vuex-usersettings/current'
      })
    },
    async mounted(){
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
