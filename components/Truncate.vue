<template>
    <span v-html="truncatedText"></span>
</template>


<script>
  import lodash from 'lodash'

  export default {
    props: ['text', 'length'],
    name: 'truncate',
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
