### Emotion Rating

```js
new Vue({
  data () {
    return {
      contribution: {
        _id: '59aaf2dc1dc22009ae442be4',
        userId: '59aa86cf1b89ed063b131494',
        emotions: {
            funny: {
                percent: 66,
                count: 2
            },
            happy: {
                percent: 0,
                count: 0
            },
            surprised: {
                percent: 33,
                count: 1
            },
            cry: {
                percent: 0,
                count: 0
            },
            angry: {
                percent: 0,
                count: 0
            }
        }
      },
      user: {
        _id: '59aa86cf1b89ed063b131494'
      }
    }
  },
  template: `<hc-emotion-rating :contribution="contribution" :user="user" />`
})
```