<template>
<div class="hc-title">
<slot></slot>
<span />
</div>
</template>

<style lang="scss">
.hc-title {
    color: #99CC33;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
    text-align: center;

    span {
      width: 40px;
      border-bottom: 1px solid #99CC33;
      display: block;
      margin: 7px auto 0;
    }
}
</style>
