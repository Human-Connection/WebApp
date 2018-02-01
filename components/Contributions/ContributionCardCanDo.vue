<template>
  <div class="cando-info">
    <div class="cando-card-difficulty">
      <can-do-difficulty :post="post" />
    </div>
    <div class="cando-card-action">
      <can-do-action :post="post" />
    </div>
    <can-do-count :post="post" />
  </div>
</template>

<script>
  import CanDoAction from '~/components/CanDos/Action'
  import CanDoCount from '~/components/CanDos/Count'
  import CanDoDifficulty from '~/components/CanDos/Difficulty'

  export default {
    name: 'hc-contribution-card-cando',
    components: {
      CanDoAction,
      CanDoCount,
      CanDoDifficulty
    },
    props: {
      post: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .cando-info {
    position: relative;
    z-index: 2;
  }

  .cando-card-difficulty {
    font-size: $size-small;
  }

  .cando-card-action {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background-color: $white-ter;
    margin-bottom: 1em;
  }
</style>
