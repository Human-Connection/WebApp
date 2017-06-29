<template>
    <div class="action-item">
        <hc-btn class="hc-button success circle" />
        <div class="action-text"><slot /></div>
    </div>
</template>

<script>
  import Button from '~components/elements/Button/Button.vue'

  export default {
    components: {
      'hc-btn': Button
    }
  }
</script>

<style scoped lang="scss">
.action-item {
    display: flex;
    align-items: baseline;
    margin: 0 0 2px 0;
    .action-text {
        font-size: 12px;
        padding-left: 10px;
    }
    #hc-add-contribution {
        box-shadow:    0 2px 3px rgba(10, 10, 10, 0.1);

        &, &:link, &:active {
            outline: none !important;
        }

        text-align:    center;
        width:         10px;
        height:        10px;
        padding:       10px 16px;
        font-size:     14px;
        line-height:   1.33;
        border-radius: 35px !important;
    }
}
</style>
