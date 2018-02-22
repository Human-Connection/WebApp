<template>
  <div class="hc-dropdown-container">
    <slot name="toggle" :class="{ 'active' : active }">
      <hc-icon icon="list"></hc-icon>
    </slot>
    <div @click="click" class="hc-dropdown" ref="dropdown">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-dropdown',
    data () {
      return {
        dropdown: null,
        active: false
      }
    },
    props: {
      persist: {
        type: Boolean,
        default: false
      },
      // Options see: https://getuikit.com/docs/dropdown
      offset: {
        type: Number,
        default: 5
      },
      position: {
        type: String,
        default: 'bottom-left'
      },
      mode: {
        type: String,
        default: 'click'
      },
      duration: {
        type: Number,
        default: 200
      }
    },
    computed: {
      options () {
        let options = {
          'offset': this.offset,
          'pos': this.position,
          'mode': this.mode,
          'delay-show': 0,
          'delay-hide': 0
        }
        return options
      }
    },
    methods: {
      open () {
        this.dropdown.show()
      },
      close () {
        this.dropdown.hide()
      },
      click () {
        if (!this.persist) {
          this.close()
        }
      }
    },
    mounted () {
      this.dropdown = require('uikit').dropdown(
        this.$refs['dropdown'],
        this.options
      )
      this.$on('close', this.close())
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-dropdown {
    box-shadow: $card-shadow-hover;
    z-index: 130;
    pointer-events: all;
    background-color: $white-bis;
    border: 1px solid $grey-lighter;
    border-radius: 5px;
    min-width: 200px;
    position: absolute;

    visibility: hidden;
    opacity: 0;
    transform: translateY(-5px);
    transition-property: visibility, opacity, transform;
    transition-duration: 86ms;
  }

  .uk-open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
</style>
