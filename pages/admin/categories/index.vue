<template>
  <section>
    <h3 class="title is-3">{{ $t('component.admin.manageCategories', 'Manage Categories') }}</h3>
    <form @submit.prevent="saveEntries">
      <table class="table is-fullwidth is-narrow">
        <thead>
          <tr>
            <th>{{ $t('component.admin.categoryTitle', 'Title') }}</th>
            <th>{{ $t('component.admin.categoryIdentifier', 'Code') }}</th>
            <th>{{ $t('component.admin.categoryIconCss', 'Icon (class)') }}</th>
            <th>{{ $t('component.admin.categoryIcon', 'Icon') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, key) in categoriesList" :key="key">
            <td>
              <input v-model="category.title" class="input" v-bind:placeholder="$t('component.admin.categoryTitlePlaceholder', 'The category’s title')">
            </td>
            <td>
              <input v-model="category.slug" class="input" v-bind:placeholder="$t('component.admin.categoryIdentifierPlaceholder', 'Code label (optional) ...')">
            </td>
            <td>
              <input v-model="category.icon" class="input" v-bind:placeholder="$t('component.admin.categoryIconCss', 'Icon CSS-Class (optional)')">
            </td>
            <td style="position: relative;">
              <div style="display: flex; align-items: center; height: 39px;">
                <hc-icon :icon="category.icon" set="hc"></hc-icon>
              </div>
            </td>
            <td>
              <hc-tooltip :label="$t('component.admin.deleteCategory')" type="is-black" position="is-left">
                <span @click.prevent="deleteEntry(key)" class="button is-danger">
                  <hc-icon icon="trash" />
                </span>
              </hc-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
      <footer class="card-footer">
        <div class="field is-grouped">
          <div class="control">
            <hc-button color="grey" @click.prevent="addEntry()">
              <hc-icon icon="plus" />
              &nbsp; {{ $t('component.admin.addCategory', 'Kategorie hinzufügen') }}
            </hc-button>
          </div>
          <div class="control">
            <hc-button>
              <hc-icon icon="check" />
              &nbsp; {{ $t('button.save') }}
            </hc-button>
          </div>
        </div>
      </footer>
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
      this.$nextTick(() => {
        this.categoriesList = JSON.parse(JSON.stringify(this.categories))
      })
    }
  }
</script>

<style scoped lang="scss">
  .table {
    th, td {
      border-bottom: none;
    }
  }
</style>
