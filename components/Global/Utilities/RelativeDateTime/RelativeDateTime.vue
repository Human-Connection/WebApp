<template>
  <span>{{ relativeDateTime }}</span>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'hc-relative-date-time',
    props: {
      dateTime: {
        type: [Date, String]
      }
    },
    data () {
      return {
        relativeDateTime: null,
        interval: 15000
      }
    },
    methods: {
      calcRelativeDateTime () {
        let t = moment(this.dateTime).locale(this.$i18n.locale() || 'en')
        this.relativeDateTime = t.utc().fromNow()
        if (this.relativeDateTime === t.add(this.interval, 'milliseconds').utc().fromNow()) {
          this.interval += 15000
        }
        setTimeout(() => {
          this.calcRelativeDateTime()
        }, this.interval)
      }
    },
    mounted () {
      this.calcRelativeDateTime()
    }
  }
</script>
