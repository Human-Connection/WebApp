<template>
    <div>
        <br/>
        <section class="container">
            <section class="hc__cards">
                <card class="card hc__card" v-for="contribution in contributions" :post="contribution" :key="contribution.slug" @ready="updateGrid()">
                    <small slot="category">{{ contribution.type }}</small>
                </card>
            </section>
        </section>
        <br/>
    </div>
</template>

<script>
  import feathers from '~plugins/feathers'
  import Bricks from 'bricks.js'
  import Card from '../components/Card'

  export default {
    components: {
      'card': Card
    },
    async asyncData () {
      let {data} = await feathers.service('contributions').find()
      return {
        contributions: data
      }
    },
    data () {
      return {
        bricksInstance: null,
        contributions: null,
        loading: false,
        errors: null
      }
    },
    head () {
      return {
        title: 'Dashboard'
      }
    },
    methods: {
      updateGrid () {
        this.bricksInstance.resize(true).pack()
      }
    },
    mounted () {
      this.bricksInstance = new Bricks({
        container: '.hc__cards',
        packed: 'data-packed',
        sizes: [
          { columns: 1, gutter: 15 },
          { mq: '769px', columns: 2, gutter: 15 },
          { mq: '1000px', columns: 3, gutter: 15 },
          { mq: '1384px', columns: 4, gutter: 15 }
        ]
      })
      this.bricksInstance.resize(true).pack()
    }
  }
</script>

<style scoped>
    section.container {
        padding-left: 20px !important;
    }
</style>
