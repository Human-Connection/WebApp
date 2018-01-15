<template>
  <section class="content">
    <h1>Einstellungen</h1>
    <h3>Development</h3>
    <div class="field is-grouped">
      <div class="control">
        <hc-button color="danger"
                   @click="seedFakeData()"
                   :isLoading="seedingFakeData"
                   :disabled="seedingFakeData || seedingDemoData">
          <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>Seed fake data</strong>
        </hc-button>
      </div>
      <div class="control">
        <hc-button color="danger"
                   @click="seedDemoData()"
                   :isLoading="seedingDemoData"
                   :disabled="seedingFakeData || seedingDemoData">
          <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>Seed demo contributions</strong>
        </hc-button>
      </div>
    </div>
  </section>
</template>

<script>
  import feathers from '~/plugins/feathers'
  feathers.service('admin').timeout = 60000

  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: 'Einstellungen'
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
        this.seedingFakeData = true
        feathers.service('admin').create({ seedFakeData: true }).then(res => {
          this.seedingFakeData = false
          this.$snackbar.open({
            message: 'Created a ton of new entries, have fun!',
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
        feathers.service('admin').create({ seedDemoData: true }).then(res => {
          this.seedingDemoData = false
          this.$snackbar.open({
            message: 'Added the demo entries to the database!',
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
