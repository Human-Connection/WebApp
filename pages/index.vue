<template>
    <section class="container" style="position: relative">
        <section class="hc__cards" v-cloak="ready">
            <card class="card hc__card" v-for="contribution in contributions" :post="contribution" :key="contribution.slug" @ready="updateGrid()">
                <small slot="category">{{ contribution.type }}</small>
            </card>
        </section>
        <button type="button" class="button is-success" id="hc-add-contribution" v-on:click="$router.push('/write')">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </button>
    </section>
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
        errors: null,
        ready: false
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
          {columns: 1, gutter: 15},
          {mq: '769px', columns: 2, gutter: 15},
          {mq: '1000px', columns: 3, gutter: 15},
          {mq: '1384px', columns: 4, gutter: 15}
        ]
      })
      this.bricksInstance.resize(true).pack()

      this.ready = true

      window.onload = () => {
        this.bricksInstance.resize(true).pack()
      }
    }
  }
</script>

<style scoped lang="scss">
    .hc__cards {
        padding:      0;
        margin-left:  auto;
        margin-right: auto;
        max-width:    100%;
    }

    #hc-add-contribution {
        cursor: pointer;
        z-index: 50;
        position: fixed;
        bottom: 50px;
        right: 50px;
        box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);


        &, &:link, &:active {
            outline: none !important;
        }

        text-align: center;
        width: 70px;
        height: 70px;
        padding: 10px 16px;
        font-size: 24px;
        line-height: 1.33;
        border-radius: 35px !important;
    }
</style>
