// this mixin will add a "k"" property (key) to the component. It will also add a computed property "text" which will return the translation for the key from the store
let translatable = {
  props: [
    'k',
    'replacements'
  ],
  computed: {
    text: function () {
      // get translation for the key
      return this.$store.getters.translate(this.k, this.replacements)
    }
  }
}

export default translatable
