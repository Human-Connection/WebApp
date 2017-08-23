<template>
  <section class="content">
    <h1>Benutzer verwalten</h1>
  </section>
</template>

<script>
  // import feathers from '~plugins/feathers'

  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: 'Benutzer verwalten'
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
