<template>
    <div class="props-table">
        <table v-if="props">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Values</th>
                    <th>Default</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(prop, name) in props">
                    <td>{{ name }}</td>
                    <td>{{ prop.description }}</td>
                    <td></td>
                    <td>
                        <div v-for="value in prop.values">
                            {{ value }}
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
  export default {
    props: [
      'props'
    ]
  }
</script>

<style scoped lang="scss">
    @import "~assets/styles/utilities";

    .props-table {
        margin-top:20px;
        border: 5px solid $white-ter;
    }
</style>
