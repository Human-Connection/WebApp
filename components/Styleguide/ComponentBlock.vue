<template>
    <div class="component-block">
        <h3 class="title is-3">
            {{ component.title }}
        </h3>
        <h4 class="title is-4">
            <code><{{ component.name }}></code>
        </h4>
        <p>
            {{ component.description }}
        </p>
        <div class="examples" v-if="component.readme">
            <h4 class="title is-4">
                Usage
            </h4>
            <component :is="component.readme" :component="component"></component>
        </div>
        <div class="props" v-if="component.props">
            <h4 class="title is-4">
                Props
            </h4>
            <props-table :props="component.props"></props-table>
        </div>
    </div>
</template>


<script>
  import ComponentProxy from '~components/Styleguide/ComponentProxy.vue'
  import PropsTable from '~components/Styleguide/PropsTable.vue'
  export default {
    components: {
      'component-proxy': ComponentProxy,
      'props-table': PropsTable
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
        margin-bottom:20px;
    }

    .example {
        padding:10px;
        margin-bottom:20px;
        border: 5px solid $white-ter;
    }
</style>
