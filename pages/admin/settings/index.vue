<template>
  <section class="content">
    <h1>{{ $t('component.admin.settings', 'Settings') }}</h1>
    <h3>{{ $t('component.admin.development', 'Development') }}</h3>
    <div class="field is-grouped">
      <div class="control">
        <hc-button color="danger"
                   @click="seedFakeData()"
                   :isLoading="seedingFakeData"
                   :disabled="seedingFakeData || seedingDemoData">
          <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>{{ $t('component.admin.seedFakeData', 'Seed fake data') }}</strong>
        </hc-button>
      </div>
      <div class="control">
        <hc-button color="danger"
                   @click="seedDemoData()"
                   :isLoading="seedingDemoData"
                   :disabled="seedingFakeData || seedingDemoData">
          <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>{{ $t('component.admin.seedDemoContributions', 'Seed demo contributions') }}</strong>
        </hc-button>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: this.$t('component.admin.settings')
      }
    },
    data () {
      return {
        seedingFakeData: false,
        seedingDemoData: false
      }
    },
    methods: {
      seedFakeData () {
        this.$api.service('admin').timeout = 60000
        this.seedingFakeData = true
        this.$api.service('admin').create({ seedFakeData: true }).then(res => {
          this.seedingFakeData = false
          this.$snackbar.open({
            message: this.$t('component.admin.seedFakeDataSuccessMessage', 'Created a ton of new entries, have fun!'),
            duration: 4000,
            type: 'is-success'
          })
        }).catch(err => {
          console.error(err)
          this.seedingFakeData = false
          this.$toast.open({
            message: err.message,
            duration: 3000,
            type: 'is-danger'
          })
        })
      },
      seedDemoData () {
        this.seedingDemoData = true
        this.$api.service('admin').create({ seedDemoData: true }).then(res => {
          this.seedingDemoData = false
          this.$snackbar.open({
            message: this.$t('component.admin.seedDemoContributionsSuccessMessage', 'Added the demo entries to the database!'),
            duration: 4000,
            type: 'is-success'
          })
        }).catch(err => {
          console.error(err)
          this.seedingDemoData = false
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

<style lang="scss">

</style>
