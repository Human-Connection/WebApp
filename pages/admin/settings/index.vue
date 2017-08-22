<template>
  <section class="content">
    <h1>Einstellungen</h1>
  </section>
</template>

<script>
  // import feathers from '~plugins/feathers'

  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: 'Einstellungen'
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
