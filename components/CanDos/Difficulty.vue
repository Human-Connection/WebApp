<template>
  <div class="cando-difficulty">
    {{ $t('component.contribution.difficultyDescription') }}: <strong>{{ $t(`difficulty.${canDo.difficulty}`) }}</strong>
  </div>
</template>

<script>
  export default {
    name: 'hc-cando-difficulty',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    computed: {
      canDo () {
        return this.post.cando
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .cando-difficulty {
    text-transform: uppercase;
    margin-bottom: 1em;
    color: $grey;

    strong {
      color: $grey-darker;
    }
  }
</style>
