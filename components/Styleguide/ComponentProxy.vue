<script>
  export default {
    props: ['name', 'props', 'value'],
    render (createElement) {
      return createElement(this.name,
        {
          props: this.props
        },
        this.$slots.default
      )
    }
  }
</script>