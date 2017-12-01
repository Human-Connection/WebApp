<template>
  <div class="filter-item has-text-centered" @click.prevent="$emit('toggle')">
    <hc-button circle 
               size="small" 
               :color="itemState"
               :disabled="disabled"
               :class="{
                 'active': active,
                 'disabled': disabled
               }">
      <slot name="icon">
        <hc-icon v-if="icon" :set="iconSet" :icon="icon" />
      </slot>
    </hc-button>
    <small>{{ title }}</small>
  </div>
</template>

<script>
  export default {
    name: 'hc-filter-item',
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      iconSet: {
        type: String,
        default: 'hc'
      },
      active: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      itemState () {
        return this.active ? 'success' : 'disabled'
      }
    },
    created () {
      console.log(this.item)
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .filter-item {
    display: inline-block;
    width: 6rem;
    vertical-align: bottom;
    cursor: pointer;
    margin-bottom: 1.5rem;

    button.button {
      font-size: 1.3em;
      margin-bottom: 0.6rem;

      img.emoji {
        transform: scale(1.8);
      }
    }

    small {
      display: inline-block;
      font-size: 0.8em;
      line-height: 1.2em;
      height: 3em;
      width: 100%;
      color: $grey;
    }
  }
</style>
