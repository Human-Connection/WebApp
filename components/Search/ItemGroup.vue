<template>
  <div class="hc-search-group" v-if="group.items && group.items.length">
    <div class="hc-search-group-header">
      <h3>
        {{ $t(`ressource.name.${group.name}`) }}
      </h3>
    </div>
    <transition-group>
      <div v-for="(item, index) in group.items"
        :key="item._id" :class="`hc-group-${groupindex}-item-${index}`">
        <search-item :item="item" :ressource="group.name"
          :selected="isSelected(index)"
          @itemselected="(value) => { $emit('itemselected', value) }" />
      </div>
    </transition-group>
  </div>
</template>

<script>
  import SearchItem from '~/components/Search/Item.vue'

  export default {
    name: 'hc-search-group',
    components: {
      SearchItem
    },
    props: {
      group: {
        type: Object,
        required: true
      },
      groupindex: {
        type: Number
      },
      currentgroupindex: {
        type: Number
      },
      currentindex: {
        type: Number
      }
    },
    methods: {
      isSelected (index) {
        return this.groupindex === this.currentgroupindex && this.currentindex === index
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-search-group-header {
    display: flex;
    align-items: center;
    padding: 7px $padding-small;
    border-bottom: 1px solid $border;

    h3 {
      margin: 0;
      font-size: $size-small;
      color: $grey;
    }
  }
</style>
