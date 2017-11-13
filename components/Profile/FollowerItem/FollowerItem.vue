<template>
  <div class="hc-follower-item">
    <hc-avatar class="hc-follower-image" :url="image"></hc-avatar>
    <div class="hc-follower-details">
      <span class="details-title">{{ title }}</span>
      <span class="details-timestamp">Letzter Post: {{ timestamp }}</span>
      <!--<hc-action-item>some action text</hc-action-item>-->
    </div>
  </div>
</template>

<script>
  import Avatar from '~/components/Avatar/Avatar'

  export default {
    name: 'hc-follower-item',
    components: {
      'hc-avatar': Avatar
    },
    props: ['title', 'timestamp', 'image']
  }
</script>

<style lang="scss">
  .hc-follower-item {
    display: flex;
    padding-bottom: 8px;

    .hc-follower-image {
      padding-right: 5px;
      width:         42px;
      height:        42px;
    }
    .hc-follower-details {
      display: flex;
      flex-direction: column;
      padding-left: 15px;
      .details-title {
        font-size: 12px;
        font-weight: bold;
      }
      .details-timestamp {
        font-size: 10px;
      }
    }
  }
</style>
