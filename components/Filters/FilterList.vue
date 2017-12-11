<template>
  <div class="filter-list columns">
    <div class="column is-1">
      <filter-item
          :active="allActive"
          :disabled="toggleAllDisabled"
          icon="check"
          iconSet="fa"
          :title="$t('component.filter.all')"
          @toggle="toggleAll" />
    </div>
    <div class="column is-11">
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
  import _ from 'lodash'
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
        this.selectedIds = _.extend([], itemIds)
      },
      selectedIds (itemIds) {
        this.$emit('input', itemIds)
        this.$emit('change', itemIds)
      }
    },
    computed: {
      allActive () {
        return this.selectedIds.length === this.items.length
      },
      toggleAllDisabled () {
        return !!(this.allActive && (this.selectedIdsBeforeToggled.length === this.items.length || !this.selectedIdsBeforeToggled.length))
      }
    },
    methods: {
      toggleItem (id) {
        const index = this.selectedIds.indexOf(id)

        if (index > -1) {
          this.selectedIds.splice(index, 1)
        } else {
          this.selectedIds.push(id)
        }

        if (this.selectedIds.length === 0) {
          this.toggleAll()
        } else {
          this.$emit('change', this.selectedIds)
        }
      },
      toggleAll () {
        if (this.toggleAllDisabled) {
          return
        }

        if (this.allActive) {
          this.selectedIds = this.selectedIdsBeforeToggled
          // this.selectedIdsBeforeToggled = []
        } else {
          this.selectedIdsBeforeToggled = this.selectedIds
          this.selectedIds = _.map(this.items, '_id')
        }

        if (this.selectedIdsBeforeToggled.length === 0) {
          this.selectedIdsBeforeToggled = this.selectedIds
        }

        this.$emit('change', this.selectedIds)
      },
      isActive (id) {
        return this.selectedIds.indexOf(id) > -1
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
</style>
