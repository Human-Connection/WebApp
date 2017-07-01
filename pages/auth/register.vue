<template>
    <section class="container content">
        <div class="card">
            <div class="card-content">
                <div class="card-teaser">
                    <img src="/assets/images/registration/humanconnection.png" alt="Human Connection"/>
                </div>
                <p class="subtitle is-6">Tritt Human Connection bei und nimm an der Community teil. Dein Account ist kostenlos und wird es immer bleiben.</p>
                <form @submit.prevent="register">
                    <div class="field">
                        <p class="control has-icons-right">
                            <input class="input" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="E-Mail" v-model="data.email">
                            <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control has-icons-right">
                            <input class="input" v-bind:class="{ 'is-danger': errors }" type="password" placeholder="Password" v-model="data.password" autocomplete="new-password">
                            <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
                        </p>
                    </div>
                    <div class="field has-text-le">
                        <b-checkbox>Ich bestätige, dass ich über 18 Jahre alt bin.</b-checkbox>
                    </div>
                    <p>
                        <button class="button is-primary is-fullwidth is-medium" v-bind:class="{ 'is-loading': loading }">Registrieren</button>
                    </p>
                </form>
                <p class="small-info">Mit Klick auf „registrieren“ erkläre ich mich mit den <nuxt-link :to="{ name: 'legal' }">Nutzerbedingungen</nuxt-link> einverstanden und bestätige, dass ich die Human Connection <nuxt-link :to="{ name: 'legal' }">Datenschutzerklärung</nuxt-link> gelesen habe.</p>
            </div>
            <footer class="card-footer">
                <nuxt-link :to="{ name: 'login' }" class="card-footer-item">
                    Du hast ein Konto?
                </nuxt-link>
            </footer>
        </div>
    </section>
</template>

<script>
  export default {
    middleware: 'anonymous',
    layout: 'blank',
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
              message: 'Thanks for joining us. Please check your mailbox in order to complete your registration.',
              duration: 6000,
              type: 'is-success'
            })
            this.$router.replace({ name: 'auth-name' })
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

<style lang="scss" scoped>
    .card {
        margin: 0 auto;
        max-width: 460px;
        text-align: center;
    }

    .subtitle {
        margin-top:30px;
    }

    .card-teaser {
        img {
            display: inline-block;
            max-width: 260px;
            height: auto;
        }
    }

    form {
        margin: 1em auto;
        padding: 1em;
        text-align: left;
    }
</style>
