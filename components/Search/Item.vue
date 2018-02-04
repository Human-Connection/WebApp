<template>
  <div class="hc-search-item" :class="{ 'selected' : selected  }"
    @click="$emit('itemselected', { item, ressource })">
    <div class="hc-search-item-icon">
      <hc-avatar :user="item" v-if="ressource === 'users'" />
    </div>
    <div class="hc-search-item-details">
      <div class="hc-search-item-name">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-search-item',
    props: {
      item: {
        type: Object,
        required: true
      },
      ressource: {
        type: String,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-search-item {
    min-height: 50px;
    padding: 5px $padding-small;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    &:hover, &.selected {
      color: $grey-darker;
      text-decoration: none;
      background-color: $white-ter;
      font-weight: bold;
    }
  }

  .hc-search-item-icon {
    flex: 0 0 50px;
  }

  .hc-search-item-details {
    flex-grow: 1;
  }
</style>
