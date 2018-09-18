<template>
  <div class="columns">
    <div class=" column is-8 is-offset-2">
      <div class="card">
        <section class="section">
          <!--<h1 class="title">Edit {{ title }}</h1>-->
          <contributions-form v-on:input="editorText" :data="form"></contributions-form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import ContributionsForm from '~/components/Contributions/ContributionsForm.vue'
  import protectable from '~/components/mixins/protectable'

  export default {
    mixins: [protectable],
    middleware: ['verified', 'owner'],
    components: {
      ContributionsForm
    },
    async asyncData ({app, params, error}) {
      try {
        let res = await app.$api.service('contributions').find({
          query: {
            slug: params.slug
          }
        })
        const data = res.data[0]
        return {
          form: data,
          title: data.title
        }
      } catch (err) {
        error({statusCode: err.code || 500, message: err.message})
        return {}
      }
    },
    data () {
      return {
        isLoading: false,
        form: {}
      }
    },
    head () {
      return {
        title: `Edit ${this.title}`
      }
    },
    methods: {
      editorText (newText) {
        this.protectText(newText)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .card {
    border: none;
    box-shadow: $card-shadow;
  }
</style>
