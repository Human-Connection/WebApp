<template>
    <section class="container is-vcentered">
        <br/>
        <div class="columns is-vcentered">
            <div class="column is-6 is-offset-3">
                <div class="card">
                    <form class="card-content">
                        <img src="logo-vertical.svg" alt="Human Connection" class="logo level-left" style="max-width: 200px; margin: auto;"/>
                        <br/>
                        <p>Tritt Humen Connection bei in nimm an der Community teil. Dein Account ist Kostenlos und wird es immer bleiben.</p>
                        <br/>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input is-primary" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="Email" v-model="data.username">
                                <span v-if="errors" class="icon is-small is-right">
                                  <i class="fa fa-warning"></i>
                                </span>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input is-primary" v-bind:class="{ 'is-danger': errors }" type="password" placeholder="Password" v-model="data.password">
                                <span v-if="errors" class="icon is-small is-right">
                                  <i class="fa fa-warning"></i>
                                </span>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control">
                                <label class="checkbox">
                                    <input type="checkbox">
                                    Ich bestätige, dass ich über 18 Jahre alt bin.
                                </label>
                            </p>
                        </div>
                        <button class="button is-primary is-fullwidth" v-on:click="register" v-bind:class="{ 'is-loading': loading }">Login</button>
                        <br/>
                        <p>Mit klick auf „Regestrieren“ erkläre ich mich mit den Nutzerbedingungen einverstanden und betsätige das ich die Human Connection Datenschutzerklärung gelesen habe.</p>
                    </form>
                    <footer class="card-footer">
                        <nuxt-link :to="{ name: 'login' }" class="card-footer-item">
                            Du hast ein Konto?
                        </nuxt-link>
                    </footer>
                </div>
            </div>
        </div>
        <br/>
    </section>
</template>

<script>
  import axios from '~plugins/axios'

  export default {
    middleware: 'unauthorized',
    data () {
      return {
        data: {
          username: '',
          password: ''
        },
        loading: false,
        errors: null
      }
    },
    methods: {
      async register (e) {
        e.preventDefault()
        this.errors = false
        try {
          this.loading = true
          let user = await axios.post('/register', this.data)
          this.$store.commit('SET_USER', user.data.data.user)
          console.log(user.data.data)
          this.loading = false
          this.credentials.password = null
        } catch (error) {
          console.log(error)
          this.errors = true
          this.loading = false
        }
      }
    },
    head () {
      return {
        title: 'Register'
      }
    }
  }
</script>

<style scoped>
    .title {
        margin: 30px 0;
    }
</style>
