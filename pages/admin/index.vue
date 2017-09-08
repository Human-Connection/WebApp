<template>
  <section class="content">
    <h1>Übersicht</h1>
  </section>
</template>

<script>
  // import feathers from '~/plugins/feathers'

  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: 'Kategorien verwalten'
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
