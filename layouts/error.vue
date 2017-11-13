<template>
  <section class="container content">
    <div class="card">
      <div class="card-content has-text-centered">
        <br/><br/><br/>
        <hc-emoji type="surprised" width="150px"></hc-emoji>
        <h1 class="title">
          <strong>{{ error.statusCode }}</strong>
        </h1>
        <p class="info">
          {{ error.message }}
        </p>
        <hc-button type="nuxt" to="/"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back to normal</hc-button>
      </div>
    </div>
  </section>
</template>
<script>
  import HcEmoji from '~/components/Global/Elements/Emoji/Emoji.vue'

  export default {
    components: {
      HcEmoji
    },
    props: ['error'],
    head () {
      return {
        title: this.error.statusCode
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";

  .title {
    margin-top: 8px !important;
    font-size: 5em;
    margin-bottom: 5px;
  }

  .info {
    font-weight: 300;
    color: #5b6569;
    margin: 0;
  }

  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
    border: none;
    box-shadow: $card-shadow;
  }

  .button {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
