<template>
    <div class="columns">
        <div class="card column is-8 is-offset-2">
            <section class="section">
                <h1 class="title">Edit {{ title }}</h1>
                <contributions-form :data="form"></contributions-form>
            </section>
        </div>
    </div>
</template>

<script>
  import ContributionsForm from '~components/Contributions/ContributionsForm.vue'
  import feathers from '~plugins/feathers'

  export default {
    middleware: ['verified', 'owner'],
    components: {
      ContributionsForm
    },
    async asyncData ({params, error}) {
      try {
        let res = await feathers.service('contributions').find({
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
        loading: false,
        form: {}
      }
    },
    head () {
      return {
        title: `Edit ${this.title}`
      }
    }
  }
</script>

<style>

</style>
