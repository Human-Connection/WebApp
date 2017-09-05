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
    middleware: 'verified',
    components: {
      ContributionsForm
    }
  }
</script>

<style>

</style>
