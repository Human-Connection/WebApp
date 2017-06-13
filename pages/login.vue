<template>
    <section class="container is-vcentered">
        <br/>
        <div v-if="user" class="columns is-vcentered">
            <div class="column is-6 is-offset-3 has-text-centered">
                <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
                <h1 class="title">YOU ARE LOGGED IN {{user.username}}!</h1>
                <button class="button is-fullwidth" v-on:click="logout">Logout</button>
            </div>
        </div>
        <div v-else class="columns is-vcentered">
            <div class="column is-6 is-offset-3 has-text-centered">
                <div class="card">
                    <form class="card-content">
                        <img src="logo-hc.svg" alt="Human Connection" class="logo level-left" style="max-width: 200px"/>
                        <br/>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input is-primary" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="Email" v-model="credentials.username">
                                <span v-if="errors" class="icon is-small is-right">
                                  <i class="fa fa-warning"></i>
                                </span>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input is-primary" v-bind:class="{ 'is-danger': errors }" type="password" placeholder="Password" v-model="credentials.password">
                                <span v-if="errors" class="icon is-small is-right">
                                  <i class="fa fa-warning"></i>
                                </span>
                            </p>
                        </div>
                        <button class="button is-primary is-fullwidth" v-on:click="login" v-bind:class="{ 'is-loading': loading }">Login</button>
                        <br/>
                        <a href="" class="pull-left">
                            Noch kein Konto?
                        </a>
                        <a href="" class="pull-right">
                            Passwort vergessen?
                        </a>
                        <br/>
                    </form>
                </div>
            </div>
        </div>
        <br/>
    </section>
</template>

<script>
  import axios from '~plugins/axios'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        loading: false,
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      async login (e) {
        e.preventDefault()
        this.errors = false
        try {
          this.loading = true
          let user = await axios.post('/login', this.credentials)
          this.$store.commit('SET_USER', user.data.data.user)
          console.log(user.data.data)
          this.loading = false
          this.credentials.password = null
        } catch (error) {
          console.log(error)
          this.errors = true
          this.loading = false
        }
      },
      async logout () {
        this.loading = true
        try {
          let res = await axios.post('/logout')
          console.log(res)
          this.$store.commit('SET_USER', null)
          axios.defaults.headers.common.cookie = ''
          this.loading = false
        } catch (error) {
          this.loading = false
        }
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
