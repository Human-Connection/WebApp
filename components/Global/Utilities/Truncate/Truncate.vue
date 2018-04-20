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
        type: String,
        required: true
      },
      /**
       * The number of characters
       */
      length: {
        type: [Number, String],
        required: true
      },
      options: {
        type: Object,
        default: (options) => {
          return Object.assign({
            seperator: /,? +/
          }, options)
        }
      }
    },
    computed: {
      truncatedText () {
        if (!this.text) {
          return ''
        }
        return truncate(this.text, {
          length: this.length,
          separator: this.options.separator
        })
      }
    }
  }
</script>
