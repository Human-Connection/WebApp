<template>
    <button type="button" class="hcCircleButton">
        <i class="fa fa-plus" aria-hidden="true"></i>
    </button>
</template>

<script>
  export default {
    name: 'hc-button-circle'
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
</style>