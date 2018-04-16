<template>
  <section id="page-auth-logout"></section>
</template>

<script>
  export default {
    async mounted () {
      await this.$api.logout()
      this.$store.commit('auth/SET_TOKEN', null)
      this.$store.commit('auth/SET_USER', null)
      this.$router.push('/auth/login')
    },
    layout: 'blank'
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";
  @import "assets/styles/_animations";

  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
    border: none;
    box-shadow: $card-shadow;
  }

  .subtitle {
    padding-top: 30px;
  }

  .card-teaser {
    img {
      display: inline-block;
      height: 140px;

      @include tablet {
        max-width: 240px;
        height: auto;
      }
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
