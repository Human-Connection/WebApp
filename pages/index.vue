<template>
  <section class="container" style="position: relative">
    <section class="cards" v-cloak="ready">
      <card class="card" v-for="contribution in contributions" :post="contribution" :key="contribution.slug"
            @ready="updateGrid">
        <small slot="category">{{ contribution.type }}</small>
      </card>
    </section>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="waveDots"></infinite-loading>
    <div class="add-contribution">
      <hc-button color="primary" size="large" type="nuxt" to="/contributions/write" circle v-if="isVerified">
        <hc-icon icon="plus"/>
      </hc-button>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import feathers from '~/plugins/feathers'
  import Bricks from 'bricks.js'
  import Card from '~/components/Contributions/ContributionCard.vue'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'

  export default {
    components: {
      'card': Card,
      'infinite-loading': InfiniteLoading
    },
    async asyncData () {
      let sort = {
        createdAt: -1
      }
      let res = await feathers.service('contributions').find({
        query: {
          $sort: sort
        }
      })
      return {
        contributions: res.data,
        limit: res.limit,
        skip: res.limit,
        sort: sort
      }
    },
    data () {
      return {
        bricksInstance: null,
        contributions: null,
        errors: null,
        ready: false,
        limit: null,
        skip: 0,
        sort: {}
      }
    },
    computed: {
      ...mapGetters({
        changeLayout: 'layout/change',
        isVerified: 'auth/isVerified'
      })
    },
    watch: {
      changeLayout () {
        var app = this
        app.$nextTick(() => {
          app.updateGrid()
        })
      }
    },
    methods: {
      updateGrid () {
        this.bricksInstance.resize(true).pack()
      },
      onInfinite () {
        feathers.service('contributions').find({
          query: {
            $skip: this.skip,
            $sort: this.sort
          }
        }).then(res => {
          console.log(res)
          this.contributions = this.contributions.concat(res.data)
          setTimeout(() => {
            this.updateGrid()

            let lastItemNum = res.data.length + res.skip
            if (lastItemNum < res.total) {
              // do load more
              this.skip = res.skip + res.limit
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            } else {
              // do NOT load more
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          }, 100)
        }).catch(err => {
          throw new Error(500, err.message)
        })
      }
    },
    mounted () {
      this.bricksInstance = new Bricks({
        container: '.cards',
        packed: 'data-packed',
        sizes: [
          {columns: 1, gutter: 15},
          {mq: '769px', columns: 2, gutter: 15},
          {mq: '1000px', columns: 3, gutter: 15},
          {mq: '1192px', columns: 3, gutter: 20},
          {mq: '1300px', columns: 3, gutter: 20}
        ]
      })
      this.updateGrid()

      this.ready = true

      window.onload = () => {
        this.updateGrid()
      }
    },
    head () {
      return {
        title: 'Welcome'
      }
    }
  }
</script>

<style scoped lang="scss">
  .cards {
    padding: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }

  .add-contribution {
    z-index: 50;
    position: fixed;
    bottom: 50px;
    right: 50px;

    .button {
      box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
    }
  }
</style>
