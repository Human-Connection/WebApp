<template>
    <div class="component-readme">
        <example-block>
            <component :is="component.name" color="primary">
                Primary Button
            </component>
            <component :is="component.name" color="info">
                Info Button
            </component>
        </example-block>
    </div>
</template>

<script>
  import ExampleBlock from '~components/Styleguide/ExampleBlock.vue'
  export default {
    components: {
      'example-block': ExampleBlock
    },
    props: [
      'component'
    ]
  }
</script>

<style scoped lang="scss">
    @import "~assets/styles/utilities";
</style>