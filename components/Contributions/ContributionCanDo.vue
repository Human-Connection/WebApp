<template>
  <div class="cando-info">
    <div class="cando-difficulty">
      <strong>{{ $t('component.contribution.difficultyDescription') }}:</strong> {{ $t(`difficulty.${canDo.difficulty}`) }}
    </div>
    <div class="cando-action">
      <hc-button>
        <hc-icon icon="plus" /> {{ $t('component.contribution.canDoAdd') }}
      </hc-button>
    </div>
    <div class="cando-count">
      {{ $t('component.contribution.canDoCountedDescription', {count: canDoCount}, canDoCount) }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-contribution-cando',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    computed: {
      canDo () {
        return this.post.cando
      },
      canDoCount () {
        return this.post.candoUsers ? this.post.candoUsers.length : 0
      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .cando-difficulty {
    text-transform: uppercase;
    font-size: $size-small;
    margin-bottom: 1em;
    font-weight: bold;

    strong {
      color: $grey;
    }
  }

  .cando-action {
    margin-bottom: 1em;
  }
</style>
