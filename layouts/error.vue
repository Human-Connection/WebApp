<template>
  <section class="container">
    <br/><br/><br/>
    <div class="columns is-vcentered">
      <div class=" column is-6 is-offset-3 has-text-centered">
        <hc-emoji type="surprised" width="150px"></hc-emoji>
        <h1 class="title is-1">
          <strong>{{ error.statusCode }}</strong>
        </h1>
        <p class="info">
          {{ error.message }}
        </p>
      </div>
    </div>
    <br/>
  </section>
</template>
<script>
  import HcEmoji from '~/components/Global/Elements/Emoji/Emoji.vue'

  export default {
    components: {HcEmoji},
    props: ['error'],
    head () {
      return {
        title: this.error.statusCode
      }
    }
  }
</script>

<style scoped>
  .title {
    margin-top: 15px;
    font-size: 5em;
    margin-bottom: 5px;
  }

  .info {
    font-weight: 300;
    color: #5b6569;
    margin: 0;
  }

  .button {
    margin-top: 50px;
  }
</style>
