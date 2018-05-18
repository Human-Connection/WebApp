<template>
  <section>
    <div class="createPageForm">
      <h3 class="title is-3">{{ $t('component.admin.managePages', 'Manage Pages') }}</h3>
      <page-form-modal :page="selectedPage" @close="onClose" />
      <div class="pageList">
        <no-ssr>
          <v2-table :data="pagesList"
                    :stripe="true"
                    :loading="pagesLoading"
                    :total="pages.total"
                    :shown-pagination="totalPages > 1"
                    :pagination-info="paginationInfo"
                    @page-change="handlePageChange">
            <v2-table-column label="Title" prop="title" align="left">
              <template slot-scope="row">
                <hc-icon
                    style="color: #f00; padding-right: 5px;"
                    v-if="isProtected(row.type)"
                    icon="warning" />
                <a @click.prevent="editPage(row)">
                  <strong v-if="isProtected(row.type)">{{ row.title }}</strong>
                  <span v-else>{{ row.title }}</span>
                </a>
              </template>
            </v2-table-column>
            <v2-table-column label="Slug" prop="slug" align="left">
              <template slot-scope="row">
                <hc-button type="link" :to="`/pages/${row.slug}`" target="_blank">{{ row.slug }}</hc-button>
              </template>
            </v2-table-column>
            <v2-table-column label="Type" prop="type" align="left">
              <template slot-scope="row">
                {{ row.type ? $t(`component.admin.pageType${upperFirst(row.type)}`, row.type) : '' }}
              </template>
            </v2-table-column>
            <v2-table-column label="Active" align="right" width="60">
              <template slot-scope="row" v-show="row.active">
                <i v-if="isProtected(row.type)"
                    class="fa fa-lg fa-toggle-on"
                    style="cursor: not-allowed; opacity: .5"></i>
                <a v-else @click.prevent="toggleActiveState(row)">
                  <i v-if="row.active" class="fa fa-lg fa-toggle-on"></i>
                  <i v-else class="fa fa-lg fa-toggle-off"></i>
                </a>
              </template>
            </v2-table-column>
          </v2-table>
        </no-ssr>
      </div>
    </div>
    <footer class="card-footer">
      <div class="field is-grouped">
        <div class="control">
          <hc-button color="grey" @click.prevent="editPage()">
            <hc-icon icon="plus" />
            &nbsp; {{ $t('button.add') }}
          </hc-button>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
  import moment,{ defaultFormat } from 'moment'
  import { isEmpty, map, keyBy, upperFirst, groupBy, each } from 'lodash'
  import pageFormModal from '~/components/Pages/PageFormModal'

  let itemLimit = 100

  export default {
    middleware: 'admin',
    layout: 'admin',
    components: {
      pageFormModal
    },
    data () {
      return {
        currentModalLang: 'de',
        isCreateModalActive: false,
        itemLimit: itemLimit,
        pagesLoading: true,
        pages: [],
        selectedPage: null,
        isLoading: false,
        disabled: false,
        currentPage: 1,
        paginationInfo: {
          text: '', // this.paginationText,
          nextPageText: '>',
          prevPageText: '<'
        }
      }
    },
    async asyncData ({app}) {
      const pages = await app.$api.service('pages').find({
        query: {
          $limit: itemLimit
        }
      })
      return {
        pages: pages,
        pagesLoading: false,
        itemLimit: itemLimit
      }
    },
    filters: {
      formatDate (val) {
        return moment(val).format('d.m.Y')
      }
    },
    computed: {
      totalPages () {
        return this.pages.total / this.itemLimit
      },
      paginationText () {
        return `<span>Total of <strong>${this.pages ? this.pages.total : 0}</strong>, <strong>${this.itemLimit}</strong> per page</span>`
      },
      pagesList () {
        let output = []
        let groups = groupBy(this.pages.data, 'key')
        each(groups, (items, key) => {
          const langs = keyBy(items, 'language')
          if (langs[this.$i18n.locale()]) {
            // get item of current language
            output.push(Object.assign({}, langs[this.$i18n.locale()]))
          } else {
            // get first item
            output.push(Object.assign({}, langs[Object.keys(langs).shift()]))
          }
        });
        return output
      }
    },
    methods: {
      editPage (page = {}) {
        this.selectedPage = page
        // this.isCreateModalActive = true
        // this.$nextTick(() => {
        //   this.form = Object.assign({}, page)
        // })
      },
      async onClose () {
        this.selectedPage = null
        const pages = await this.$api.service('pages').find({
          query: {
            $limit: this.itemLimit
          }
        })
        this.pages = pages
      },
      isProtected (type) {
        return ['imprint','termsAndConditions','privacyPolicy'].includes(type)
      },
      async toggleActiveState (page) {
        await this.$api.service('pages').patch(page._id, {
          active: !page.active
        })
        page.active = !page.active
        this.$snackbar.open({
          message: this.$t('auth.settings.saveSettingsSuccess'),
          duration: 2000,
          type: 'is-success'
        })
      },
      upperFirst (val) {
        return upperFirst(val)
      },
      async handlePageChange (page) {
        this.currentPage = page
        this.pagesLoading = true
        const start = (page - 1) * itemLimit

        this.pages = await this.$api.service('pages').find({
          query: {
            $limit: itemLimit,
            $skip: start
          }
        })
        this.pagesLoading = false
      },
    },
    head () {
      return {
        title: this.$t('component.admin.managePages', 'Manage Pages')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .field {
    margin-bottom: 10px;
    .label {
      margin-bottom: 5px;
    }
  }

  .cell-name {
    font-weight: bold;
  }

  a[disabled] {
    pointer-events: none;
  }

  .link {
    white-space: nowrap;
    cursor: pointer;
    color: $primary;
  }

  .fa-check-circle {
    color: $primary;
  }

  $padding: 1.5rem;
  footer.card-footer {
    margin: -$padding;
    margin-top: 2rem;
    margin-bottom: -2rem;
    background: lighten($grey-lighter, 10%);
    padding: 1rem $padding 0.5rem;
    display: flex;
    justify-content: left;
  }

  .fa-toggle-off {
    color: $red;
  }
</style>
