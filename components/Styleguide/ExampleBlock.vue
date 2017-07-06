<template>
    <div class="example-block">
        <div class="example-rendered">
            <slot></slot>
        </div>
        <div class="example-code">
            <code>
                {{ code }}
            </code>
        </div>
    </div>
</template>

<script>
  export default {
    computed: {
      code () {
      }
    }
  }
</script>