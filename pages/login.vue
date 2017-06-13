<template>
    <section class="container">
        <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
        <h1 class="title">LOGIN</h1>
        <h1 v-if="user">LOGGED IN {{user.username}}!</h1>
        <form v-else>
            <input type="text" v-model="credentials.username"/>
            <input type="text" v-model="credentials.password"/>
            <button class="button is-primary is-fullwidth" v-on:click="login">Login</button>
        </form>
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
        try {
          let user = await axios.post('/login', this.credentials)
          this.$store.commit('SET_USER', user.data.data.user)
          console.log(user.data.data)
        } catch (error) {
          console.log(error)
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
