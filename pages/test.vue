<template>
  <div style="width: 90vw; word-break: break-all;">
    <h1 class="title is-size-1">TEST PAGE</h1>
    <h2 class="title is-size-2">tokenServer</h2>
    <p>
      <strong v-if="tokenServer">{{ tokenServer }}</strong>
    </p><br />
    <h2 class="title is-size-2">tokenClient</h2>
    <p>
      <strong v-if="tokenClient">{{ tokenClient }}</strong>
    </p><br />
    <h2 class="title is-size-2">User:</h2>
    <p>
      Name: <strong>{{ user.name || 'Anonymus' }}</strong><br />
      E-Mail: <strong>{{ user.email || '???' }}</strong>
    </p>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    layout: 'blank',
    async asyncData ({app}) {
      return {
        tokenServer: await app.$api.passport.getJWT()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        tokenClient: 'auth/token'
      })
    }
  }
</script>


<style scoped lang="scss"></style>
