<template>
  <div class="contribution-menu" v-if="isModerator">
    <b-dropdown class="is-top-center">
      <a slot="trigger">
        <hc-tooltip :label="$t('component.contribution.editSettings')" type="is-dark">
          <hc-icon icon="cog"></hc-icon>
        </hc-tooltip>
      </a>
      <b-dropdown-item @click="toggleEnabled" v-if="isModerator">
        <template v-if="post.isEnabled">
          <hc-icon icon="eye-slash"></hc-icon> {{ $t('component.contribution.actionDisable') }}
        </template>
        <template v-else>
          <hc-icon icon="eye"></hc-icon> {{ $t('component.contribution.actionEnable') }}
        </template>
      </b-dropdown-item>
      <!--
      <b-dropdown-item>
        <hc-icon icon="flag"></hc-icon> {{ $t('component.contribution.actionReport') }}
      </b-dropdown-item>
      <b-dropdown-item>
        <hc-icon icon="check"></hc-icon> {{ $t('component.contribution.actionMarkAsRead') }}
      </b-dropdown-item>
      -->
    </b-dropdown>
  </div>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import {mapGetters} from 'vuex'
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
    user-select: none;
  }
</style>
