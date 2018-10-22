<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">
      <div class="card" :class="classes">
        <section class="section">
          <contributions-form :data="form" v-on:input="editorText" @validate="onValidate" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import ContributionsForm from '~/components/Contributions/ContributionsForm.vue'
  import animatable from '~/components/mixins/animatable'
  import protectable from '~/components/mixins/protectable'

  export default {
    middleware: ['verified', 'owner'],
    mixins: [animatable, protectable],
    components: {
      ContributionsForm
    },
    methods: {
      editorText (newText) {
        this.protectText(newText)
      },
      onValidate (success) {
        if (!success) {
          this.animate('shake')
          this.isSubmitting = false
        } else {
          this.isSubmitting = true
        }
      }
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
