<template>
  <section class="content">
    <h1>Kategorien verwalten</h1>
    <form @submit.prevent="saveEntries">
      <table class="table">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Bezeichner</th>
            <th>Icon (class)</th>
            <th>Icon</th>
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
              <input v-model="category.icon" class="input" placeholder="Icon (optional) ...">
            </td>
            <td style="position: relative;">
              <div style="display: flex; align-items: center; height: 39px;">
                <hc-icon :icon="category.icon" set="hc"></hc-icon>
              </div>
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
          <hc-button color="grey" @click.prevent="addEntry()">
            <hc-icon icon="plus"></hc-icon>&nbsp; Kategorie hinzufügen
          </hc-button>
        </div>
        <div class="column has-text-right">
          <hc-button>
            <hc-icon icon="check"></hc-icon>&nbsp; Änderungen speichern
          </hc-button>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

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
        this.categoriesList = JSON.parse(JSON.stringify(categories))
      }
    },
    methods: {
      addEntry () {
        this.categoriesList.push({
          title: '',
          slug: '',
          icon: ''
        })
      },
      saveEntries () {
        this.categoriesList.forEach(category => {
          if (!category._id) {
            this.$store.dispatch('categories/create', category)
              .then((res) => {
                this.$store.dispatch('categories/fetch')
              })
          } else {
            this.$store.dispatch('categories/patch', category)
              .then((res) => {
                this.$store.dispatch('categories/fetch')
              })
          }
        })
      },
      deleteEntry (key) {
        const category = this.categoriesList.splice(key, 1)[0]
        if (category._id) {
          this.$store.dispatch('categories/delete', category)
            .then((res) => {
              this.$store.dispatch('categories/fetch')
            })
        }
      }
    },
    created () {
      this.categoriesList = JSON.parse(JSON.stringify(this.categories))
    }
  }
</script>

<style scoped lang="scss">

</style>
