<template>
    <div :style="hcBox" class="card">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'hc-box',
    props: ['top', 'bottom'],
    data () {
      return {
        hcBox: {
          'background-color': 'white',
          'padding': '15px',
          'margin-top': this.top ? '10px' : '0',
          'margin-bottom': this.bottom ? '10px' : '0'
        }
      }
    }
  }
</script>

<style lang="scss"></style>
