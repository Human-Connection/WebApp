<template>
    <span v-html="truncatedText"></span>
</template>


<script>
  import lodash from 'lodash'

  export default {
    name: 'hc-truncate',
    props: ['text', 'length'],
    computed: {
      truncatedText () {
        if (!this.text) {
          return ''
        }
        return lodash.truncate(this.text, {
          length: this.length,
          separator: /,? +/
        })
      }
    }
  }
</script>
