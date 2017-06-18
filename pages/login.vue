<template>
    <section class="container is-vcentered">
        <div class="columns is-vcentered">
            <div class="column is-6 is-offset-3 has-text-centered">
                <div class="card">
                    <form class="card-content">
                        <img src="logo-hc.svg" alt="Human Connection" class="logo level-left" style="max-width: 200px"/>
                        <br/>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="Email" v-model="data.email">
                                <span v-if="errors" class="icon is-small is-right">
                                  <i class="fa fa-warning"></i>
                                </span>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input" v-bind:class="{ 'is-danger': errors }" type="password" placeholder="Password" v-model="data.password">
                                <span v-if="errors" class="icon is-small is-right">
                                  <i class="fa fa-warning"></i>
                                </span>
                            </p>
                        </div>
                        <div class="field has-text-left">
                            <b-switch v-model="stayLoggedIn">Stay logged in</b-switch>
                        </div>
                        <button class="button is-primary is-fullwidth" v-on:click="login" v-bind:class="{ 'is-loading': loading }">Login</button>
                    </form>
                    <footer class="card-footer">
                        <nuxt-link :to="{ name: 'register' }" class="card-footer-item">
                            Noch kein Konto?
                        </nuxt-link>
                        <a href="" class="card-footer-item">
                            Passwort vergessen?
                        </a>
                    </footer>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    middleware: 'anonymous',
    data () {
      return {
        data: {
          email: '',
          password: ''
        },
        loading: false,
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    methods: {
      async login (e) {
        e.preventDefault()
        this.errors = false
        this.loading = true
        this.$store.dispatch('auth/login', this.data)
          .then(() => {
            this.$toast.open({
              message: 'congratulations, you are in!',
              duration: 2000,
              type: 'is-success'
            })
            this.loading = false
            this.data.password = null
            this.$router.replace(this.$route.query.path || '/')
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            this.errors = true
            this.loading = false
          })
      }
    },
    head () {
      return {
        title: 'Login'
      }
    }
  }
</script>

<style scoped>
    .title {
        margin: 30px 0;
    }
</style>
