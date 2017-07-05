<template>
    <div class="content">
        <h1 class="title is-1">Developer Styleguide</h1>
        <h2 class="title is-2">Global Components</h2>
        <div v-for="component in globalComponents">
            <component-block :component="component"></component-block>
        </div>
    </div>
</template>


<script>
  import ComponentBlock from '~components/Styleguide/ComponentBlock.vue'

  export default{
    components: {
      'component-block': ComponentBlock
    },
    middleware: ['development'],
    asyncData ({ app }) {
      return {
        globalComponents: app.globalComponents()
      }
    },
    methods: {
    },
    mounted () {
      console.log(this.globalComponents)
    },
    head () {
      return {
        title: 'Styleguide'
      }
    }
  }
</script>


<style scoped lang="scss">
</style>
