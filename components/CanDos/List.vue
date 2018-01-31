<template>
  <div class="cando-list">
    <table class="table is-striped">
      <tbody>
      <tr v-for="canDo in canDos" :key="canDo._id">
        <td>
          <hc-truncate :text="canDo.title" :length="50" />
          <div class="cando-list-action">
            <can-do-action :post="canDo" size="small" />
          </div>
        </td>
        <td>{{ $t(`difficulty.${canDo.cando.difficulty}`) }}</td>
        <td class="has-text-right">
          <can-do-count :post="canDo" />
        </td>
      </tr>
      <tr>
        <td colspan="3" class="is-white">
          <a href="" class="is-block is-fullwidth has-text-right">{{ $t('button.showMore', 'Mehr') }} <hc-icon icon="angle-down"></hc-icon></a>
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
    props: {
      canDos: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .cando-list-action {
    margin-top: 0.2rem;
  }
</style>
