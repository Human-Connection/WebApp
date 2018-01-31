<template>
  <div class="cando-info">
    <div class="cando-count">
      <span v-if="canDoDoneCount > 1">
        <strong>{{ canDoDoneCount }}</strong>
        {{ $t('component.contribution.canDoCountedMany') }}
      </span>
      <span v-else-if="canDoDoneCount === 1">
        {{ $t('component.contribution.canDoCountedOne') }}
      </span>
      <span v-else>
        {{ $t('component.contribution.canDoCountedNone') }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-cando-count',
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
      candoUsers () {
        return this.post.candoUsers
      },
      canDoCount () {
        return this.candoUsers ? this.candoUsers.length : 0
      },
      canDoDoneUsers () {
        return this.candoUsers.filter(({done}) => !!done)
      },
      canDoDoneCount () {
        return this.canDoDoneUsers ? this.canDoDoneUsers.length : 0
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';
</style>
