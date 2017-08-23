<template>
  <section class="content">
    <h1>Kategorien verwalten</h1>
    <form @submit.prevent="saveEntries">
      <table class="table">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Bezeichner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, key) in categoriesList" :key="key">
            <td>
              <input v-model="category.title" class="input" placeholder="Titel der Kategorie ...">
            </td>
            <td>
              <input v-model="category.slug" class="input" placeholder="Bezeichner (optional) ...">
            </td>
            <td>
              <span @click.prevent="deleteEntry(key)" class="button is-danger">
                <hc-icon icon="trash" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="columns">
        <div class="column">
          <hc-button @click.prevent="addEntry()">
            Kategorie hinzufügen
          </hc-button>
        </div>
        <div class="column has-text-right">
          <hc-button size="medium">
            Änderungen speichern
          </hc-button>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
  import feathers from '~plugins/feathers'
  import {mapGetters} from 'vuex'

  const categoriesService = feathers.service('categories')

  export default {
    middleware: 'admin',
    layout: 'admin',
    head () {
      return {
        title: 'Kategorien verwalten'
      }
    },
    computed: {
      ...mapGetters({
        categories: 'categories/all'
      })
    },
    data () {
      return {
        categoriesList: []
      }
    },
    watch: {
      categories (categories) {
        this.categoriesList = categories
      }
    },
    methods: {
      addEntry () {
        this.categoriesList.push({
          title: '',
          slug: ''
        })
      },
      saveEntries () {
        this.categoriesList.forEach(category => {
          if (!category._id) {
            categoriesService.create(category)
          } else {
            categoriesService.patch(
              category._id,
              {
                title: category.title,
                slug: category.slug
              }
            )
          }
        })
      },
      deleteEntry (key) {
        const category = this.categoriesList.splice(key, 1)[0]
        categoriesService.remove(category._id)
      }
    },
    created () {
      this.categoriesList = this.categories
    }
  }
</script>

<style scoped lang="scss">

</style>
