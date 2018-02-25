<template>
  <div class="hc-dropdown-container" :class="{ 'mobile-full' : mobileFull }">
    <slot name="toggle" :class="{ 'active' : active }">
      <hc-icon icon="list"></hc-icon>
    </slot>
    <div @click="click" class="hc-dropdown" ref="dropdown">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

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
        default: 0
      },
      position: {
        type: String,
        default: 'bottom-left'
      },
      mode: {
        type: String,
        default: 'click'
      },
      mobileFull: {
        type: Boolean,
        default: false
      },
      /**
       * Needs to be an html element
       * Normally you will provide a
       * $ref['element']
       */
      boundary: {
        default: false
      },
      boundaryAlign: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      options () {
        let options = {
          // 5 Pixel needed for transformation
          offset: this.offset - 5,
          pos: this.position,
          mode: this.mode,
          boundaryAlign: this.boundaryAlign,
          delayShow: 0,
          delayHide: 0
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
      },
      init () {
        const UIkit = require('uikit')
        if (this.boundary) {
          this.options.boundary = this.boundary
        }
        this.dropdown = UIkit.dropdown(
          this.$refs['dropdown'],
          this.options
        )
        UIkit.util.on(this.$refs['dropdown'], 'show', () => {
          this.onShow()
        })
        UIkit.util.on(this.$refs['dropdown'], 'hide', () => {
          this.onHide()
        })
      },
      onShow () {
        if (this.needsFixedScroll) {
          disableBodyScroll(this.$refs['dropdown'])
        }
      },
      onHide () {
        if (this.needsFixedScroll) {
          enableBodyScroll(this.$refs['dropdown'])
        }
      },
      needsFixedScroll () {
        return this.mobileFuill && window.width < 767
      },
      update () {
        this.close()
        this.dropdown.$destroy()
        this.init()
      }
    },
    mounted () {
      // boundary is an html element and therefore
      // only available after initial render
      this.$nextTick(() => {
        this.init()
        this.$on('close', this.close())
      })
      window.addEventListener('resize', this.update)
    },
    destroy () {
      window.removeEventListener('resize', this.update)
      clearAllBodyScrollLocks()
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-dropdown-container {
    @include until($tablet) {
      &.mobile-full {
        width: 100%;
      }
    }
  }

  .hc-dropdown {
    box-shadow: $card-shadow-hover;
    z-index: 130;
    pointer-events: all;
    background-color: $white;
    border: 1px solid $grey-lighter;
    border-radius: 5px;
    min-width: 100px;
    position: absolute;

    visibility: hidden;
    opacity: 0;
    transform: translateY(-5px);
    transition-property: visibility, opacity, transform;
    transition-duration: 400ms;
    transition-timing-function: $easeOut;

    &.uk-open {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    @include until($tablet) {
      .hc-dropdown-container.mobile-full & {
        transform: translateX(-15px);
        border-radius: 0;
        position: fixed !important;
        top: $navbar-height !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        &.uk-open {
          transform: translateX(0);
        }
      }
    }
  }
</style>
