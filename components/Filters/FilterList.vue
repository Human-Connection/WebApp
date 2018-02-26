<template>
  <div class="filter-list columns">
    <div class="column is-2">
      <filter-item
          :active="allActive"
          icon="check"
          iconSet="fa"
          :title="$t('component.filter.all')"
          @toggle="toggleAll" />
    </div>
    <div class="column is-10">
      <filter-item
          v-for="item in items"
          :key="item._id"
          :active="isActive(item._id)"
          :icon="item.icon"
          :translationPath="translationPath"
          :slug="item.slug || item.title"
          :iconSet="iconSet"
          :title="item.title"
          @toggle="toggleItem(item._id)" />
    </div>
  </div>
</template>

<script>
  import { extend, map } from 'lodash'
  import FilterItem from '~/components/Filters/FilterItem.vue'

  export default {
    name: 'hc-filter-list',
    components: {
      FilterItem
    },
    props: {
      /**
       * array of item ids that are currently selected
       */
      selected: {
        type: Array,
        default: () => []
      },
      /**
       * array of items that will be displayed in the list. { _id: '123', title: 'title', icon: 'icon' }
       */
      items: {
        type: Array,
        default: () => []
      },
      translationPath: {
        type: String
      },
      /**
       * specefy which icon set should be used, see hc-icon component for reference.
       */
      iconSet: {
        type: String,
        default: 'hc'
      }
    },
    data () {
      return {
        selectedIds: [],
        selectedIdsBeforeToggled: []
      }
    },
    watch: {
      selected (itemIds) {
        // we need to get rid of the reactivity here
        this.selectedIds = extend([], itemIds)
      },
      selectedIds (itemIds) {
        this.$emit('input', itemIds)
        this.$emit('change', itemIds)
      }
    },
    computed: {
      allActive () {
        return this.selectedIds.length === this.items.length
      }
    },
    methods: {
      toggleItem (id) {
        // get index of current item to see if its active already
        const index = this.selectedIds.indexOf(id)

        if (index > -1) {
          // remove it as its active
          if (this.allActive) {
            // set this item as the only one in the active list
            this.selectedIds = [id]
          } else {
            // remove this item from the active list
            this.selectedIds.splice(index, 1)
          }
        } else {
          // add this item to the active list
          this.selectedIds.push(id)
        }

        if (!this.selectedIds.length) {
          // enable all items as nothing is selected
          this.selectedIds = map(this.items, '_id')
        }

        this.$emit('change', this.selectedIds)
      },
      toggleAll () {
        if (this.allActive) {
          this.selectedIds = this.selectedIdsBeforeToggled
          // this.selectedIdsBeforeToggled = []
        } else {
          this.selectedIdsBeforeToggled = this.selectedIds
          this.selectedIds = map(this.items, '_id')
        }

        if (this.selectedIdsBeforeToggled.length === 0) {
          this.selectedIdsBeforeToggled = this.selectedIds
        }

        this.$emit('change', this.selectedIds)
      },
      isActive (id) {
        const index = this.selectedIds.indexOf(id)
        return index > -1 && !this.allActive
      }
    },
    created () {
      this.selectedIds = this.selected
      this.selectedIdsBeforeToggled = this.selectedIds
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .filter-list {
    position: relative;
    margin-bottom: -15px;
  }

  .column {
    @include until($tablet) {
      padding-bottom: 0;

      &.is-10 {
        padding-top: 0;
      }
    }
  }
</style>
