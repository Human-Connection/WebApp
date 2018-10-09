// This mixin can be loaded for every page component with input fields. It will confirm leaving the page in case the user has some (unsaved) input/draft pending.
let protectable = {
  beforeRouteLeave (to, from, next) {
    if (this.isComposing) {
      this.$dialog.confirm({
        title: this.$t('component.contribution.draft'),
        message: this.$t('component.contribution.draftMsg'),
        confirmText: this.$t('button.yes'),
        cancelText: this.$t('button.cancel'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => { next() }
      })
    } else {
      next()
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.beforeUnload)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeUnload)
  },
  methods: {
    beforeUnload (e) {
      if (!this.isComposing) return true
      e.preventDefault()
      // only chrome based browsers, see: https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload#Example
      let isChrome = !!window.chrome && !!window.chrome.webstore
      if (isChrome) { e.returnValue = '\o/' } // eslint-disable-line no-useless-escape
    },
    protectText (newText) {
      this.isComposing = !!newText
    }
  }
}

export default protectable
