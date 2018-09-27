<template>
  <hc-button color="button"
             :disabled="isPending || isFollowing"
             :isLoading="isPending"
             @click="toggleBlacklist">
    <template v-if="isBlacklisted()">
      <hc-icon icon="ban" :class="['icon-left', 'is-danger']" /> {{ $t('component.blacklist.buttonLabelUnblock') }}
    </template>
    <template v-else>
      <hc-icon icon="ban" class="icon-left" /> {{ $t('component.blacklist.buttonLabelBlock') }}
    </template>
  </hc-button>
</template>

<script>
import Icon from '~/components/Global/Elements/Icon/Icon.vue'
import Button from '~/components/Global/Elements/Button/Button.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'hc-block-button',
  components: {
    'hc-button': Button,
    'hc-icon': Icon
  },
  props: {
    foreignEntity: {
      type: Object,
      required: true
    },
    isFollowing: {
      required: true
    }
  },
  computed: {
    ...mapGetters({
      isPending: 'feathers-vuex-usersettings/isPending',
    })
  },
  methods: {
    isBlacklisted () {
      return this.$store.getters['feathers-vuex-usersettings/isBlacklisted'](this.foreignEntity)
    },
    async toggleBlacklist() {
      let message
      try {
        await this.$store.dispatch('feathers-vuex-usersettings/toggleBlacklist', this.foreignEntity)
        const translationKey = `component.blacklist.${this.isBlacklisted() ? 'blockSuccess' : 'unblockSuccess'}`
        message = this.$t(translationKey, {
          name: this.foreignEntity.name || this.$t('component.contribution.creatorUnknown')
        })
      } catch (error) {
        message = this.$t('component.error.general')
        throw (error)
      } finally {
        this.$snackbar.open({ message })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
@import "assets/styles/utilities";
</style>
