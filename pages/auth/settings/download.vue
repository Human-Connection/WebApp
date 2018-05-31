<template>
  <div class="security fullwidth-box">
    <div class="info-text">
      <h2 class="title is-3">
        <hc-icon icon="download" class="icon-left" />{{ $t('auth.settings.downloadData') }}
      </h2>
      <p class="subtitle is-6">{{ $t('auth.settings.downloadDescription') }}</p>
    </div>
    <transition name="fade">
      <div v-if="isProcessing" class="message is-info">
        <div class="message-body">
          {{ $t('auth.settings.downloadIsProcessing') }}
        </div>
      </div>
    </transition>
    <footer class="card-footer">
      <hc-button :isLoading="isLoading"
                 :disabled="true || isLoading || isProcessing"
                 @click.prevent="generateAndSendDownloadLink">
        <hc-icon class="icon-left" icon="paper-plane" />
        <span>{{ $t('auth.settings.downloadSendLink', 'Send Download Link') }}</span>
      </hc-button>
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        isLoading: false
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      }),
      isProcessing () {
        return this.user.downloadProcessing || this.isLoading
      }
    },
    methods: {
      async generateAndSendDownloadLink () {
        this.isLoading = true

        const res = await this.$api.service('user-data-download').create({
          userId: this.user._id
        })
        console.log('##RES', res)

        this.isLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
