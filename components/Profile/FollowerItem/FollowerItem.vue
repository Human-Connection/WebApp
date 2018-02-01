<template>
  <div class="hc-follower-item">
    <hc-avatar class="hc-follower-image" :url="image"></hc-avatar>
    <div class="hc-follower-details">
      <span class="details-title">{{ title }}</span>
      <span class="details-timestamp">{{ $t('auth.account.myFollowerItemLastContribution') }} <hc-relative-date-time :dateTime="timestamp"></hc-relative-date-time></span>
      <!--<hc-action-item>some action text</hc-action-item>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-follower-item',
    props: ['title', 'timestamp', 'image']
  }
</script>

<style lang="scss">
  .hc-follower-item {
    display: flex;
    padding-bottom: 8px;

    .hc-follower-image {
      // padding-right: 5px;
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
