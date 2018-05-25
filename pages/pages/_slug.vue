<template>
  <div class="page-pages columns">
    <div class="column is-8 is-offset-2">
      <div class="has-text-centered">
        <a href="/">
          <img src="/Logo-Horizontal-Alpha@2x.png" style="height: 100px; margin-top: 2rem;" alt="Human-0Connection"/>
        </a>
      </div>
      <div class="card">
        <section class="section">
          <b-loading :is-full-width="false" :active="isLoading" />
          <h2 class="title is-2">{{ title }}</h2>
          <div class="content" v-html="content"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import linkifyHtml from 'linkifyjs/html'

  export default {
    head () {
      return {
        title: this.title || 'loading...'
      }
    },
    data () {
      return {
        isLoading: false,
        title: '',
        content: ''
      }
    },
    async asyncData ({app, route, error}) {
      let data = {}
      if (!route.params.slug) {
        return error({ statusCode: 404 })
      }
      try {
        const res = await app.$api.service('pages').find({
          query: {
            slug: route.params.slug,
            $limit: 1,
            language: app.$i18n.locale()
          }
        })
        if (res && res.data && res.data.length) {
          data.title = res.data[0].title
          data.content = linkifyHtml(res.data[0].content)
        } else {
          return error({ statusCode: 404 })
        }
      } catch (err) {
        return error({ statusCode: 404, message: err.message })
      }
      return data
    },
    layout: 'blank'
  }
</script>

<style lang="scss">
  @import 'assets/styles/utilities';

  #page-name-pages-slug {
    .columns {
      padding: 0;
      margin: 0;
      width: 100%;

    }
    .card {
      padding: 2rem 2.5rem;
      margin: 3rem 0 4rem;
      box-shadow: $card-shadow-hover;
    }
  }
  @media (max-width: $tablet) {
    #page-name-pages-slug .column {
      padding: 0;
    }
  }

</style>
