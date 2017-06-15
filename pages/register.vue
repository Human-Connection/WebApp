<template>
    <section class="container is-vcentered">
        <div class="columns is-vcentered">
            <div class="column is-6 is-offset-3">
                <div class="card">
                    <form class="card-content">
                        <img src="logo-vertical.svg" alt="Human Connection" class="logo level-left" style="max-width: 200px; margin: auto;"/>
                        <br/>
                        <p>Tritt Human Connection bei in nimm an der Community teil. Dein Account ist kostenlos und wird es immer bleiben.</p>
                        <br/>
                        <div class="field">
                            <p class="control has-icons-right">
                                <input class="input is-primary" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="E-Mail" v-model="data.email">
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
                        <div class="field has-text-le">
                            <b-checkbox>Ich bestätige, dass ich über 18 Jahre alt bin.</b-checkbox>
                        </div>
                        <button class="button is-primary is-fullwidth" v-on:click="register" v-bind:class="{ 'is-loading': loading }">Registrieren</button>
                        <br/>
                        <p>Mit klick auf „Registrieren“ erkläre ich mich mit den <a href="">Nutzerbedingungen</a> einverstanden und bestätige, dass ich die Human Connection <a href="">Datenschutzerklärung</a> gelesen habe.</p>
                    </form>
                    <footer class="card-footer">
                        <nuxt-link :to="{ name: 'login' }" class="card-footer-item">
                            Du hast ein Konto?
                        </nuxt-link>
                    </footer>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
  export default {
    middleware: 'unauthorized',
    data () {
      return {
        data: {
          email: '',
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
        this.loading = true
        this.$store.dispatch('auth/register', this.data)
          .then(() => {
            this.loading = false
            this.data.password = null
            this.$toast.open({
              message: 'congratulations, you are in!',
              duration: 2000,
              type: 'is-success'
            })
            this.$router.replace('/')
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
