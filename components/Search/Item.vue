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
      <div class="hc-search-item-details">
        <template v-if="ressource === 'users'">
          {{ item.email }}
        </template>
        <template v-else>
          {{ $t('info.created') }}: <hc-date :date="item.createdAt" />
        </template>
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
    font-size: $size-small;
    min-height: 50px;
    padding: 5px $padding-small;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    &:hover, &.selected {
      color: $primary;
      text-decoration: none;
    }
  }

  .hc-search-item-icon {
    flex: 0 0 50px;
  }

  .hc-search-item-details {
    flex-grow: 1;

    p {
      margin-bottom: 0;
      margin-top: 0;
      line-height: 1;
    }
  }
</style>
