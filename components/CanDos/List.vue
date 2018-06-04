<template>
  <div class="cando-list">
    <table class="table is-striped is-hoverable">
      <tbody>
      <tr v-for="canDo in canDosList" :key="canDo._id" style="cursor: pointer;" @click="goToCanDo(canDo)">
        <td>
          <hc-truncate :text="canDo.title" :length="50" />
          <div class="cando-list-action">
            <can-do-action :post="canDo" size="small" @update="update" />
          </div>
        </td>
        <td>{{ $t(`difficulty.${canDo.cando.difficulty}`) }}</td>
        <td class="has-text-right">
          <can-do-count :post="canDo" />
        </td>
      </tr>
      <tr v-if="canDos.length > defaultCount">
        <td colspan="3" class="is-white">
          <a @click="showAll = true" v-if="!showAll"
            class="is-block is-fullwidth has-text-right">
            {{ $t('button.showMore', 'Mehr') }}
            <hc-icon icon="angle-down"></hc-icon>
          </a>
          <a @click="showAll = false" v-else
            class="is-block is-fullwidth has-text-right">
            {{ $t('button.showLess', 'Weniger') }}
            <hc-icon icon="angle-up"></hc-icon>
          </a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import CanDoAction from '~/components/CanDos/Action'
  import CanDoCount from '~/components/CanDos/Count'

  export default {
    name: 'hc-cando-list',
    components: {
      CanDoAction,
      CanDoCount
    },
    data () {
      return {
        defaultCount: 3,
        showAll: false
      }
    },
    computed: {
      canDosList () {
        return this.showAll
          ? this.canDos
          : this.canDos.slice(0, this.defaultCount)
      }
    },
    props: {
      canDos: {
        type: Array,
        required: true
      }
    },
    methods: {
      update () {
        this.$emit('update')
      },
      goToCanDo (canDo) {
        this.$router.push({name: 'contributions-slug', params: { slug: canDo.slug }})
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .cando-list {
    margin-bottom: 2rem;
  }

  .cando-list-action {
    margin-top: .2rem;
    margin-bottom: .2rem;
  }

  table.table {
    td {
      line-height: 1.3em !important;
    }
  }
</style>
