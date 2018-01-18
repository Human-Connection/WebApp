<template>
  <div class="contribution-menu" v-if="isModerator">
    <b-dropdown position="is-top-left">
      <a slot="trigger">
          <hc-icon icon="flag-o"></hc-icon>
      </a>
      <b-dropdown-item @click="toggleEnabled">
        <span v-if="post.isEnabled">
          {{ $t('component.contribution.actionDisable') }}
        </span>
        <span v-else>
          {{ $t('component.contribution.actionEnable') }}
        </span>
      </b-dropdown-item>
      <!--
      <b-dropdown-item>
        {{ $t('component.contribution.actionReport') }}
      </b-dropdown-item>
      <b-dropdown-item>
        {{ $t('component.contribution.actionMarkAsRead') }}
      </b-dropdown-item>
      -->
    </b-dropdown>
  </div>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import {mapGetters} from 'Vuex'
  export default {
    name: 'hc-contribution-menu',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        created: false,
        ready: false
      }
    },
    computed: {
      ...mapGetters({
        isModerator: 'auth/isModerator'
      })
    },
    methods: {
      async toggleEnabled () {
        let data = {
          isEnabled: !this.post.isEnabled
        }
        await feathers.service('contributions')
          .patch(this.post._id, data)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .contribution-menu {
    display: inline-block;
    text-align: left;
  }
</style>
