<template>
  <div class="hc-search-list">
    <transition-group>
      <div v-for="(group, index) in list" :key="index">
          <search-item-group :group="group" :groupindex="index"
            :currentgroupindex="currentGroupIndex" :currentindex="currentIndex"
            @itemselected="itemSelected" />
      </div>
    </transition-group>
  </div>
</template>

<script>
  import SearchItemGroup from '~/components/Search/ItemGroup.vue'
  import $ from 'jquery'
  import { scrollCheck } from '~/helpers/scroll-tools'

  export default {
    name: 'hc-search-list',
    components: {
      SearchItemGroup
    },
    props: {
      list: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        currentGroupIndex: 0,
        currentIndex: 0
      }
    },
    methods: {
      itemSelected (item) {
        this.$emit('itemselected', item)
      },
      focusItem (groupIndex, index) {
        let group = this.list[groupIndex]
        // Exit if group doesn't exist
        if (!group) {
          return
        }

        // If index is negative, go to previous group
        if (index < 0) {
          let previousGroup = this.list[groupIndex - 1]
          if (!previousGroup) {
            return
          }
          return this.focusItem(groupIndex - 1, previousGroup.items.length - 1)
        }

        // If group is empty or index is too high,
        // go to next group
        if (!group.items || index >= group.items.length) {
          return this.focusItem(groupIndex + 1, 0)
        }
        this.currentGroupIndex = groupIndex
        this.currentIndex = index
        this.checkItemVisibility()
      },
      checkItemVisibility () {
        let groupindex = this.currentGroupIndex
        let index = this.currentIndex
        let itemClass = `.hc-group-${groupindex}-item-${index}`
        let listEl = $(this.$el)
        let itemEl = listEl.find(itemClass)
        scrollCheck(itemEl, listEl)
      },
      focusNextItem () {
        this.focusItem(this.currentGroupIndex, this.currentIndex + 1)
      },
      focusPreviousItem () {
        this.focusItem(this.currentGroupIndex, this.currentIndex - 1)
      },
      handleKeys (e) {
        if (!this.list || !this.list.length) {
          return true
        }
        let char = e.which
        // enter
        if (char === 13) {
          let group = this.list[this.currentGroupIndex]
          let item = group.items[this.currentIndex]
          let ressource = group.name
          this.itemSelected({item, ressource})
          e.preventDefault()
        }
        // up
        if (char === 38) {
          this.focusPreviousItem()
          e.preventDefault()
        }
        // down
        if (char === 40) {
          this.focusNextItem()
          e.preventDefault()
        }
      }
    },
    watch: {
      list (list) {
        if (list && list.length) {
          this.$nextTick(() => {
            this.focusItem(0, 0)
          })
        }
      }
    },
    // ToDo: Remove jquery, add vanilla event listener
    mounted () {
      $(document).on('keydown', this.handleKeys)
    },
    beforeDestroy () {
      $(document).off('keydown', this.handleKeys)
    }
  }
</script>

<style lang="scss" scoped>
  .hc-search-list {
    position: relative;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
