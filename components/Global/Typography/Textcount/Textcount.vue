<template>
    <div class="textCount">
        <span>{{ count }}</span>
        {{ text }}
    </div>
</template>

<script>
  export default {
    name: 'hc-textcount',
    props: ['count', 'text']
  }
</script>

<style lang="scss">
    .textCount {
        text-transform: uppercase;
        font-size:      10px;
        color:          #9c3;
        line-height:    19px;
        span {
            font-size: 19px;
            color:     grey;
            display:   block;
        }
    }
</style>
