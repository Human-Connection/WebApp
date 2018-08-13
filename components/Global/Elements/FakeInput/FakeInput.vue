<template>
  <div class="hc-fake-input" contenteditable @click="handleClick">
    <span class="hc-fake-input-item" contenteditable="false">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'hc-fake-input',
    props: {
    },
    methods: {
      handleClick (e) {
        this.$emit('deleteItem')
        e.preventDefault()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-fake-input {
    border: 1px solid $grey-lighter;
    outline: none;
    border-radius: 3px;
    height: 2.6em;
    display: flex;
    align-items: center;
    padding: 0 6px;
  }
</style>
