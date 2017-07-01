<template>
    <section class="container">
        <app-upload></app-upload>
    </section>
</template>

<script>
  import AppUpload from '../components/Upload/Upload.vue'

  export default {
    components: {
      'app-upload': AppUpload
    },
    head () {
      return {
        title: 'Upload'
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
