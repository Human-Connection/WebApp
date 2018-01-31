<template>
  <div class="cando-reason">
    <h3>{{ canDo.reasonTitle }}</h3>
    <div v-html="canDo.reason">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-cando-reason',
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

  .cando-reason {
    background-color: $white-ter;
    padding: 1rem;
  }
</style>
