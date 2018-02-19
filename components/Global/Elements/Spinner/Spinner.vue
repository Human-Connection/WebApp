<template>
  <span class="hc-spinner">
    <span class="hc-spinner-inner" :style="style">
      <svg class="hc-spinner-circular" viewBox="25 25 50 50">
        <circle class="hc-spinner-path" cx="50" cy="50" r="20"
          fill="none" :stroke-width="strokeWidth" stroke-miterlimit="10"/>
      </svg>
    </span>
  </span>
</template>

<script>
  export default {
    name: 'hc-spinner',
    props: {
      height: {
        type: Number,
        default: 28
      }
    },
    computed: {
      style () {
        return 'height: ' + this.height + 'px;' +
          'width: ' + this.height + 'px;'
      },
      strokeWidth () {
        return 1.8 * 28 / this.height
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hc-spinner-inner {
    position: relative;
    display: block;
  }

  .hc-spinner-circular {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .hc-spinner-path {
    stroke: currentColor;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>
