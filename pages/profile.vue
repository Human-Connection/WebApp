<template>
    <section class="container">
        <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
        <h1 class="title">
            USERS </h1>
        <ul class="users">
            <li v-for="(user, index) in users" class="user">
                <nuxt-link class="button" :to="{ name: 'id', params: { id: index }}">
                    {{ user.name }}
                </nuxt-link>
            </li>
        </ul>
        <nuxt-link v-if="!this.$store.getters.user" :to="{ name: 'login' }" class="button">
            Login
        </nuxt-link>
    </section>
</template>

<script>
  import axios from '~plugins/axios'

  export default {
    async asyncData () {
      let {data} = await axios.get('/api/users')
      return {
        users: data
      }
    },
    head () {
      return {
        title: 'Users'
      }
    }
  }
</script>

<style scoped>
    .title {
        margin: 30px 0;
    }

    .users {
        list-style: none;
        margin:     0;
        padding:    0;
    }

    .user {
        margin: 10px 0;
    }
</style>
