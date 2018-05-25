<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">
      <div class="card">
        <section class="section">
          <contributions-form></contributions-form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import ContributionsForm from '~/components/Contributions/ContributionsForm.vue'

  export default {
    middleware: ['authenticated', 'verified'],
    components: {
      ContributionsForm
    },
    deactivated () {
      this.$destroy()
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
