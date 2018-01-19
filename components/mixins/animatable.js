// this mixin will add a "k"" property (key) to the component. It will also add a computed property "text" which will return the translation for the key from the store
let animatable = {
  data () {
    return {
      classes: []
    }
  },
  methods: {
    animate (className, duration = 1) {
      this.classes.splice(this.classes.indexOf(className), 1)
      this.classes.splice(this.classes.indexOf('animated'), 1)
      this.$nextTick(() => {
        this.classes.push('animated')
        this.classes.push(className)
      })
      setTimeout(() => {
        this.classes.splice(this.classes.indexOf(className), 1)
        this.classes.splice(this.classes.indexOf('animated'), 1)
      }, duration * 1000)
    }
  }
}

export default animatable
