<template>
    <div class="component-block">
        <h3 class="title is-3">
            <{{ component.name }}>
        </h3>
        <p>
            {{ component.description }}
        </p>
        <div class="examples" v-if="component.examples && component.examples.length">
            <h4 class="title is-4">
                Usage
            </h4>
            <div class="example" v-for="example in component.examples">
                <component-proxy :name="component.name" :props="example.props">
                    <template v-if="example.slot">
                        {{ example.slot }}
                    </template>
                </component-proxy>
                <div>
                    <code>
                        {{ exampleCode(component, example) }}
                    </code>
                </div>
            </div>
        </div>
    </div>

</template>


<script>
  import ComponentProxy from '~components/Styleguide/ComponentProxy.vue'
  export default {
    components: {
      'component-proxy': ComponentProxy
    },
    props: [
      'component'
    ],
    methods: {
      exampleCode (component, example) {
        let code = `<${component.name}`
        Object.keys(example.props).map((prop) => {
          let value = example.props[prop]
          code += ` ${prop}="${value}"`
        })
        code += `>`
        if (example.slot) {
          code += example.slot
        }
        code += `</${component.name}>`
        return code
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "~assets/styles/utilities";

    .component-block {
        padding:20px;
        background-color:$white;
        margin-bottom:5px;
    }
</style>
