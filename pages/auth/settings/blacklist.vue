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
  export default {
    components: {
      Author
    },
    data() {
      return {
        blacklistedUsers: [],
      }
    },
    async asyncData ({store}) {
      const { blacklist } = store.getters['feathers-vuex-usersettings/current'];
      if (!blacklist) return {}
      const res = await store.dispatch('feathers-vuex-users/find', { query: {_id: { $in: blacklist } } } );
      return {
        blacklistedUsers: res.data
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
