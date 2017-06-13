<template>
    <span>{{ relativeDateTime }}</span>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['dateTime'],
    name: 'relative-date-time',
    data () {
      return {
        relativeDateTime: null
      }
    },
    methods: {
      calcRelativeDateTime () {
        this.relativeDateTime = moment(this.dateTime).utc(true).fromNow(true)
      }
    },
    mounted () {
      this.calcRelativeDateTime()

      setInterval(() => {
        this.calcRelativeDateTime()
      }, 15000)
    }
  }
</script>
