<template>
  <div class="cando-reason" v-show="reason">
    <h3>{{ canDo.reasonTitle }}</h3>
    <div v-html="canDo.reason">
    </div>
  </div>
</template>

<script>
  import linkifyHtml from 'linkifyjs/html'

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
      },
      reason () {
        return linkifyHtml(this.canDo.reason || '')
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
