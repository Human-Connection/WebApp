<template>
  <div class="hc-progress-bar">
    <div class="hc-progress-bar-inner" :style="style">
      <div class="hc-progress-bar-indicator"
        :style="indicatorStyle">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-progress-bar',
    data () {
      return {
        indicatorWidth: 0,
        success: false
      }
    },
    props: {
      progress: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 3
      }
    },
    computed: {
      style () {
        let styles = []
        let progress = this.success ? 100 : this.progress
        styles.push(`width: ${progress}%`)
        styles.push(`height: ${this.height}px`)
        if (progress === 0 || progress === 100) {
          styles.push(`opacity: 0`)
        }
        return styles.join('; ')
      },
      indicatorStyle () {
        let styles = []
        styles.push(`width: ${this.indicatorWidth}px`)
        return styles.join('; ')
      }
    },
    watch: {
      progress (progress) {
        if (progress === 100) {
          this.startSuccess()
        }
      }
    },
    methods: {
      startSuccess () {
        this.success = true
        setTimeout(() => {
          this.success = false
        }, 2000)
      }
    },
    mounted () {
      this.indicatorWidth = this.$el.offsetWidth
      window.addEventListener('resize', () => {
        this.indicatorWidth = this.$el.offsetWidth
      })
    }
  }
</script>

<style lang="scss" scoped>
  // @import "font-awesome/css/font-awesome.min.css";
  @import "~assets/styles/fonts/hc-icons.scss";

  .hc-progress-bar {
    position: relative;
  }

  .hc-progress-bar-inner {
    overflow: hidden;
    transition: opacity 0.5s ease-in-out;
  }

  .hc-progress-bar-indicator {
    height: 100%;
    $color1: #1da0d8;
    $color2: #3973b6;
    $color3: #804182;
    $color4: #df0b17;
    $color5: #eb7e03;
    $color6: #f8b933;
    $color7: #91b936;
    background: -webkit-linear-gradient(left, $color1 , $color2, $color3, $color4, $color5, $color6, $color7); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(right, $color1, $color2, $color3, $color4, $color5, $color6, $color7); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(right, $color1, $color2, $color3, $color4, $color5, $color6, $color7); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to right, $color1 , $color2, $color3, $color4, $color5, $color6, $color7);

    background-size: 100%;
    // animation: ProgressAnimation 100ms ease;
  }
</style>
