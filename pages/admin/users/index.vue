<template>
  <section class="content">
    <h1>{{ $t('component.admin.manageUsers', 'Manage Users') }}</h1>
    <h3>{{ $t('component.admin.-', 'Invite-Codes') }}</h3>
    <div class="field isGrouped columns">
      <div class="control column">
        <textarea v-model.trim="form.codes" class="textarea" rows="8" placeholder="emails"></textarea>
      </div>
      <div class="control column">
        <textarea class="textarea is-disabled" rows="8" readonly placeholder="results">{{ results }}</textarea>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <hc-button color="danger"
                   @click="generateInviteCodes()"
                   :isLoading="isLoading"
                   :disabled="isLoading">
          <hc-icon set="fa" icon="magic"></hc-icon> &nbsp;<strong>{{ $t('component.admin.-', 'Generate Invite-Codes') }}</strong>
        </hc-button>
      </div>
      <hr/>
    </div>
  </section>
</template>

<script>
  import feathers from '~/plugins/feathers'
  // feathers.service('admin').timeout = 60000

  export default {
    middleware: 'admin',
    layout: 'admin',
    data () {
      return {
        form: {
          codes: ''
        },
        isLoading: false,
        results: ''
      }
    },
    methods: {
      generateInviteCodes () {
        const emails = this.form.codes.replace(/\n|\r|^\s+|\s+$|\s+(?=\s)|,$/g, '').split(',')

        this.isLoading = true
        this.results = ''
        feathers.service('admin').create({ createInvites: emails }).then(res => {
          this.isLoading = false
          this.$snackbar.open({
            message: this.$t('component.admin.-', 'Created new Invite-Codes'),
            duration: 4000,
            type: 'is-success'
          })
          res.forEach(item => {
            this.results += `${item.email}, ${item.code}\n`
          })
        }).catch(err => {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            duration: 3000,
            type: 'is-danger'
          })
        })
      }
    },
    head () {
      return {
        title: 'Benutzer verwalten'
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
