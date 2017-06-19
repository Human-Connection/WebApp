<template>
    <div class="columns">
        <div class="column is-8 is-offset-2">
            <div class="card">
                <section class="section">
                    Hello {{ user.username || user.email || 'anonymus' }}
                </section>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    middleware: ['authenticated'],
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      })
    },
    head () {
      return {
        title: 'Profile'
      }
    }
  }
</script>

<style scoped>

</style>
