<template>
    <div class="hc-follower-item">
        <div class="hc-follower-image"><img src="https://randomuser.me/api/portraits/women/42.jpg" alt=""></div>
        <div class="hc-follower-details">
            <span class="details-title">{{ title }}</span>
            <span class="details-timestamp">Letzter Post: {{ timestamp }}</span>
            <hc-action-item>some action text</hc-action-item>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'hc-follower-item',
    props: ['title', 'timestamp']
  }
</script>

<style lang="scss">
    .hc-follower-item {
        display: flex;
        .hc-follower-image {
            padding-right: 5px;
            img {
                width:         60px;
                height:        60px;
                border-radius: 60px;
                border:        1px solid lightgrey;
            }
        }
        .hc-follower-details {
            display:        flex;
            flex-direction: column;
            padding-left:   15px;
            .details-title {
                font-size:   12px;
                font-weight: bold;
            }
            .details-timestamp {
                font-size: 10px;
            }
        }
    }
</style>
