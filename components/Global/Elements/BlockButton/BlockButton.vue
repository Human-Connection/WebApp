<template>
  <div class="columns is-mobile field has-text-centered">
    <div class="column control has-text-centered">
      <hc-button color="button"
                 :disabled="isPending"
                 :isLoading="isPending"
                 @click="click">
        <template v-if="isBlacklisted()">
          <hc-icon icon="ban" :class="['icon-left', 'is-danger']" /> {{ $t('component.blacklist.buttonLabelUnblock') }}
        </template>
        <template v-else>
          <hc-icon icon="ban" class="icon-left" /> {{ $t('component.blacklist.buttonLabelBlock') }}
        </template>
      </hc-button>
    </div>
  </div>
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
    confirmation: {
      type: Function
    }
  },
  computed: {
    ...mapGetters({
      isPending: 'feathers-vuex-usersettings/isPending',
      currentUserSettings: 'feathers-vuex-usersettings/current'
    })
  },
  methods: {
    isBlacklisted () {
      let { blacklist } = this.currentUserSettings || {}
      return blacklist && blacklist.includes(this.foreignEntity._id)
    },
    async click(){
      if (this.confirmation && !this.isBlacklisted()) {
        return await this.confirmation(this.toggleBlacklist)
      } else return await this.toggleBlacklist()
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
