<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">
      <div class="card" :class="classes">
        <section class="section">
          <contributions-form @validate="onValidate" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import animatable from '~/components/mixins/animatable'
  import ContributionsForm from '~/components/Contributions/ContributionsForm.vue'

  export default {
    middleware: ['verified'],
    mixins: [animatable],
    components: {
      ContributionsForm
    },
    deactivated () {
      this.$destroy()
    },
    methods: {
      onValidate (success) {
        if (!success) {
          this.animate('shake')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';
  @import "assets/styles/_animations";

  .card {
    border: none;
    box-shadow: $card-shadow;
  }
</style>
