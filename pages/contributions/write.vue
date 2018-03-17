<template>
  <div class="columns">
    <div class="card column is-8 is-offset-2">
      <section class="section">
        <contributions-form></contributions-form>
      </section>
    </div>
  </div>
</template>

<script>
  import ContributionsForm from '~/components/Contributions/ContributionsForm.vue'

  export default {
    middleware: ['authenticated', 'verified'],
    components: {
      ContributionsForm
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .card {
    border: none;
    box-shadow: $card-shadow;
  }
</style>
