<template>
  <span>{{ dateString }}</span>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'hc-date',
    props: {
      date: {
        type: [Date, String, Object]
      }
    },
    computed: {
      locale () {
        return this.$i18n.locale() || 'en'
      },
      dateString () {
        moment.locale(this.locale)
        let t = moment(this.date)
        return t.format('Do MMM YYYY')
      }
    }
  }
</script>
