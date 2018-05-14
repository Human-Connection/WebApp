<template>
  <div class="categories-select">
    <span class="tag"
          v-for="category in categories"
          :key="category._id"
          :class="{
            'active': isActive(category._id),
            'disabled': isDisabled(category._id)
          }"
          @click.prevent="toggleCategory(category._id)">
      <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon> {{ $t(`component.category.slug2label-${category.slug}`) }}
    </span>
    <p class="small-info">
      {{ $t('component.category.infoSelectedNoOfMaxCategories', {n:selectedCount, max:selectedMax} ) }}
    </p>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'hc-categories-select',
    props: {
      value: {
        type: Array,
        default: () => []
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedMax: 3,
        selectedCategoryIds: []
      }
    },
    computed: {
      ...mapGetters({
        categories: 'categories/all'
      }),
      selectedCount () {
        return this.selectedCategoryIds.length
      },
      reachedMaximum () {
        return this.selectedCount >= this.selectedMax
      }
    },
    watch: {
      selectedCategoryIds (categoryIds) {
        this.$emit('input', categoryIds)
        this.$emit('change', categoryIds)
      },
      value (value) {
        this.selectedCategoryIds = this.value
      }
    },
    methods: {
      toggleCategory (id) {
        const index = this.selectedCategoryIds.indexOf(id)
        if (index > -1) {
          this.selectedCategoryIds.splice(index, 1)
        } else if (!this.isDisabled(id)) {
          this.selectedCategoryIds.push(id)
        }
      },
      isActive (id) {
        if (this.selectedCategoryIds.indexOf(id) > -1) {
          return true
        }
        return false
      },
      isDisabled (id) {
        return !!((this.reachedMaximum && !this.isActive(id)) || this.disabled)
      }
    },
    created () {
      this.selectedCategoryIds = this.value
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .tag {
    cursor: pointer;
    transition: all 0.1s ease-out;
    user-select: none;
    margin-bottom: 5px;
    margin-right: 5px;

    &:hover {
      background-color: $grey-lighter;
    }

    &.active {
      background-color: $primary;
      color: $white;
    }

    &.disabled {
      background-color: $white-ter;
      opacity: 0.5;
      cursor: default;
    }
  }
</style>
