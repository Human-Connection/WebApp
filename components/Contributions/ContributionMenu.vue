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
      toggleEnabled () {
        let data = {
          isEnabled: !this.post.isEnabled
        }
        feathers.service('contributions')
          .patch(this.post._id, data)
          .then(data => {
            this.$store.commit('newsfeed/updateContribution', data)
            this.$snackbar.open({
              message: this.$t('component.contribution.settingsSavedSuccess'),
              duration: 4000,
              type: 'is-success'
            })
          })
          .catch((err) => {
            console.error(err)
            this.isLoading = false
            this.$toast.open({
              message: err.message,
              duration: 3000,
              type: 'is-danger'
            })
          })
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
