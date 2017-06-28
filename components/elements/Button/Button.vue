<template>
    <button type="button" class="hcCircleButton success" :style="hcCircleButton">
        <i :style="icon" class="fa fa-plus" aria-hidden="true"></i>
    </button>
</template>

<script>
  export default {
    props: ['size'],
    data () {
      return {
        hcCircleButton: {
          'width': this.size === 'big' ? '70px' : '20px',
          'height': this.size === 'big' ? '70px' : '20px',
          'border-radius': this.size === 'big' ? '70px' : '20px'
        },
        icon: {
          'font-size': this.size === 'big' ? '21px' : '10px'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.hcCircleButton {
        box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
        border: transparent;
        color: #fff;
        display: flex;
        justify-content: center;
}

.default {
    background-color: black;
}

.success {
    background-color: #86b31e;
    &:hover {
      background-color: #7ea81c;
    }  
}
</style>