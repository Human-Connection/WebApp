<template>
  <div class="columns">
    <div class="card column is-8 is-offset-2">
      <section class="section">
        <organizations-form></organizations-form>
      </section>
    </div>
  </div>
</template>

<script>
  import OrganizationsForm from '~/components/Organizations/OrganizationsForm.vue'

  export default {
    middleware: ['authenticated', 'verified'],
    components: {
      OrganizationsForm
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
