<template>
  <span v-html="truncatedText"></span>
</template>


<script>
  import { truncate } from 'lodash'

  export default {
    name: 'hc-truncate',
    props: {
      /**
       * The text to shorten
       */
      text: {
        type: String
      },
      /**
       * The number of characters
       */
      length: {}
    },
    computed: {
      truncatedText () {
        if (!this.text) {
          return ''
        }
        return truncate(this.text, {
          length: this.length,
          separator: /,? +/
        })
      }
    }
  }
</script>
