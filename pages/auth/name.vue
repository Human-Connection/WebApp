<template>
    <section class="container content">
        <div class="card">
            <div class="card-content">
                <div class="card-teaser">
                    <img src="/assets/images/registration/nicetomeetyou.svg" alt="Human Connection"/>
                </div>
                <h1 class="title is-3 is-spaced">Wie dürfen wir dich nennen?</h1>
                <p class="subtitle is-6">Es ist nicht erforderlich deinen vollen Namen anzugeben, du erleichterst damit aber Freunden und Bekannten dich auf Human Connection zu finden.</p>
                <form @submit.prevent="register">
                    <div class="field">
                        <p class="control has-icons-right">
                            <input class="input is-medium" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="Dein Name ..." v-model="data.name" autofocus>
                            <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
                        </p>
                    </div>
                    <p>
                        <button class="button is-primary is-fullwidth is-medium" v-bind:class="{ 'is-loading': loading }">Speichern</button>
                    </p>
                </form>
            </div>
            <footer class="card-footer">
                <nuxt-link :to="{ name: 'auth-welcome' }" class="card-footer-item">
                    Überspringen
                </nuxt-link>
            </footer>
        </div>
    </section>
</template>

<script>
  export default {
    middleware: 'authenticated',
    layout: 'blank',
    data () {
      return {
        data: {
          name: ''
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
        this.$store.dispatch('auth/patch', this.data)
          .then(() => {
            this.loading = false
            this.$router.push({ name: 'auth-welcome' })
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
        title: 'Nice to meet you'
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "~assets/styles/utilities";

    .card {
        margin: 0 auto;
        max-width: 460px;
        text-align: center;
    }

    .card-teaser {
        img {
            display: inline-block;
            max-width: 200px;
            height: auto;

            @include tablet {
                max-width: 260px;
            }
        }
    }

    form {
        margin: 1em auto;
        padding: 1em;
        text-align: left;
    }
</style>
