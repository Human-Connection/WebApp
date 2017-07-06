<template>
    <label class="label">
        <slot></slot>
    </label>
</template>


<script>
  import translatable from '~components/mixins/translatable'

  export default {
    mixins: [translatable],
    data () {
      return {}
    }
  }
</script>


<style>

</style>
