<template>
    <div class="action-item">
        <hc-button color="primary" size="xsmall" circle>
            <hc-icon icon="plus"></hc-icon>
        </hc-button>
        <div class="action-text"><slot /></div>
    </div>
</template>

<script>
  export default {
    name: 'hc-action-item'
  }
</script>

<style lang="scss" scoped>
    .action-item {
        display: flex;
        align-items: baseline;
        margin: 0 0 2px 0;
        .action-text {
            font-size: 12px;
            padding-left: 10px;
        }
    }
</style>
