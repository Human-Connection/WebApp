<template>
    <div class="action-item">
        <hc-btn class="hc-button success circle" />
        <div class="action-text"><slot /></div>
    </div>
</template>

<script>
  import Button from '~components/elements/Button/Button.vue'

  export default {
    name: 'hc-action-item',
    components: {
      'hc-btn': Button
    }
  }
</script>

<style scoped lang="scss">
.hc-button {

  &.circle {
    width: 17px;
    height: 17px;
    border-radius: 17px;

    i {
      font-size: 11px;
    }

    &.big {
      width: 70px;
      height: 70px;
      border-radius: 70px;
      i {
        font-size: 21px;
      }
    }
  }

  &.default {
    background-color: black;
  }

  &.success {
      background-color: #86b31e;
      &:hover {
        background-color: #7ea81c;
      }
  }
}

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
