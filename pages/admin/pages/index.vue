<template>
  <section>
    <div class="createPageForm">
      <h3 class="title is-3">{{ $t('component.admin.managePages', 'Manage Pages') }}</h3>
      <b-modal :active.sync="isCreateModalActive" has-modal-card animation="zoom-in">
        <div class="modal-background"></div>
        <div class="modal-card" :class="classes">
          <header class="modal-card-head is-extended">
            <h4 class="modal-card-title">{{ $t(`component.admin.${form._id ? 'pageEdit' : 'pageCreate'}`) }}</h4>
            <div class="tabs">
              <ul>
                <li class="is-active"><a><img width="16" :src="`/assets/svg/flags/de.svg`" />&nbsp;{{ $t('component.admin.languageDE') }}</a></li>
                <li><a><img width="16" :src="`/assets/svg/flags/en.svg`" />&nbsp;{{ $t('component.admin.languageEN') }}</a></li>
              </ul>
            </div>
          </header>
          <section class="modal-card-body" ref="modalContent">
            <div class="columns">
              <div class="column">
                <div class="field is-required" ref="title">
                  <label class="label" for="form-title">{{ $t('component.admin.labelTitle') }}</label>
                  <div class="control" :class="{ 'has-error': $v.form.title.$error }">
                    <input
                      class="input"
                      id="form-title"
                      data-test="title"
                      :class="{ 'is-danger': $v.form.title.$error }"
                      maxlength="64"
                      v-model.trim="form.title"
                      @blur="$v.form.title.$touch()"
                      type="text"
                      :placeholder="$t('component.admin.labelTitle')"
                      :disabled="isLoading">
                  </div>
                  <p :class="{ 'is-hidden': !$v.form.title.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorTitle') }}</p>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <div class="is-normal">
                    <label class="label">{{ $t('component.admin.labelType') }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select is-fullwidth">
                          <select v-model="form.type">
                            <option value="page" selected>{{ $t('component.admin.pageTypePage') }}</option>
                            <option value="imprint">{{ $t('component.admin.pageTypeImprint') }}</option>
                            <option value="privacyPolicy ">{{ $t('component.admin.pageTypePrivacyPolicy') }}</option>
                            <option value="termsAndConditions">{{ $t('component.admin.pageTypeTermsAndConditions') }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-required">
              <label class="label" for="form-content">{{ $t('component.admin.labelContent') }}</label>
              <div class="control" :class="{ 'has-error': $v.form.content.$error }">
                <hc-editor
                  identifier="content"
                  id="form-content"
                  data-test="content"
                  v-model.trim="form.content"
                  :class="{ 'is-danger': $v.form.content.$error }"
                  @blur="$v.form.content.$touch()"
                  :loading="isLoading"
                  :editorOptions="editorOptions"></hc-editor>
              </div>
              <p :class="{ 'is-hidden': !$v.form.content.$error }" class="help is-danger">{{ $t('component.contribution.validationErrorContent') }}</p>
            </div>
            <div class="columns">
              <div class="column">
                <div class="field">
                  <div class="is-normal">
                    <label class="label">{{ $t('component.admin.labelLanguage') }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select">
                          <select v-model="form.language">
                            <option v-for="lang in languages" :key="lang" :value="lang">{{ $t(`component.admin.language${lang.toUpperCase()}`) }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </section>
          <footer class="modal-card-foot">
            <hc-button color="light" @click.prevent="isCreateModalActive = false">
              <hc-icon icon="times" />
              &nbsp; {{ $t('button.cancel') }}
            </hc-button>
            <hc-button color="success"
                        @click="savePage"
                        :isLoading="isLoading"
                        :disabled="isLoading">
              <hc-icon class="icon-left" icon="check" /> {{ $t('button.save') }}
            </hc-button>
          </footer>
        </div>
      </b-modal>
      <div class="pageList">
        <v2-table :data="pages.data"
                  :stripe="true"
                  :loading="pagesLoading"
                  :total="pages.total"
                  :shown-pagination="true"
                  :pagination-info="paginationInfo"
                  @page-change="handlePageChange">
          <v2-table-column label="Title" prop="title" align="left">
            <template slot-scope="row">
              <hc-icon
                  style="color: #f00"
                  v-show="['imprint','termsOfService','privacy'].includes(row.type)"
                  icon="warning" />&nbsp;
              <a @click.prevent="editPage(row)">{{ row.title }}</a>
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
          <v2-table-column label="" prop="language" width="32">
            <template slot-scope="row">
              <img width="16" :src="`/assets/svg/flags/${row.language}.svg`" />
            </template>
          </v2-table-column>
          <v2-table-column label="Active" prop="createdAt" align="right" width="60">
            <template slot-scope="row" v-show="row.active">
              <i v-if="row.type === 'termsAndConditions'"
                  class="fa fa-lg fa-toggle-on"
                  style="cursor: not-allowed; opacity: .5"></i>
              <a v-else @click.prevent="toggleActiveState(row)">
                <i v-if="row.active" class="fa fa-lg fa-toggle-on"></i>
                <i v-else class="fa fa-lg fa-toggle-off"></i>
              </a>
            </template>
          </v2-table-column>
        </v2-table>
      </div>
    </div>
    <footer class="card-footer">
      <div class="field is-grouped">
        <div class="control">
          <hc-button color="grey" @click.prevent="isCreateModalActive = true">
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
  import { isEmpty, map, keyBy, upperFirst } from 'lodash'
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  let itemLimit = 10

  const languages = ['de', 'en']
  let defaultForm = {
    _id: null,
    type: 'page',
    title: '',
    content: '',
    language: 'en'
  }

  export default {
    middleware: 'admin',
    layout: 'admin',
    mixins: [animatable, validationMixin],
    data () {
      defaultForm.language = this.$i18n.locale()

      return {
        form: Object.assign({}, defaultForm),
        languages,
        isCreateModalActive: false,
        itemLimit: itemLimit,
        pagesLoading: true,
        pages: [],
        isLoading: false,
        disabled: false,
        currentPage: 1,
        paginationInfo: {
          text: '', // this.paginationText,
          nextPageText: '>',
          prevPageText: '<'
        },
        editorOptions: {
          placeholder: this.$t('component.admin.labelContent')
        },
      }
    },
    validations () {
      let rules = {
        title: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(64)
        },
        content: {
          required
        },
        key: {
        }
      }

      return {
        form: rules
      }
    },
    async asyncData ({app}) {
      const limit = itemLimit
      const pages = await app.$api.service('pages').find({
        query: {
          $limit: limit,
          $sort: {
            createdAt: -1
          }
        }
      })
      return {
        pages: pages,
        pagesLoading: false,
        itemLimit: limit
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
      }
    },
    watch: {
      isCreateModalActive (val) {
        this.form = Object.assign({}, defaultForm)
        this.$v.$reset()
      },
      'form.requireConfirmation' (val) {
        if (val) {
          this.form.permanent = false
        }
      },
      'form.type' (val) {
        if (val === 'termsAndConditions') {
          this.form.requireConfirmation = true
          this.form.permanent = false
        }
      }
    },
    methods: {
      editPage (page) {
        this.isCreateModalActive = true
        this.$nextTick(() => {
          this.form = Object.assign({}, page)
        })
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
      toggleMode (mode) {
        if (mode === 'once') {
          this.form.permanent = !this.form.permanent
        }

        if (mode === 'confirmation') {
          this.form.requireConfirmation = !this.form.requireConfirmation
        }
      },
      async savePage() {
        if (this.$v.form.$invalid) {
          this.animate('shake')
          this.$toast.open({
            message: this.$t('component.contribution.validationError'),
            type: 'is-danger'
          })
          setTimeout(() => {
            this.$scrollTo(this.$refs.title, 500, {
              container: this.$refs.modalContent
            })
            this.$v.form.$touch()
          }, 500)
          return
        }

        this.isLoading = true

        try {
          const formData = Object.assign({}, this.form)
          let res
          if (!formData._id) {
            res = await this.$api.service('pages').create(formData)
          } else {
            res = await this.$api.service('pages').patch(formData._id, formData)
          }
          if(!isEmpty(res)) {
            const pages = await this.$api.service('pages').find({
              query: {
                $limit: this.itemLimit,
                $sort: {
                  createdAt: -1
                }
              }
            })
            this.form.title = ''
            this.form.content = ''
            this.pages = pages
            this.isLoading = false
            this.$snackbar.open({
              message: this.$t('component.admin.createPageSuccess'),
              type: 'is-success'
            })

            this.isCreateModalActive = false
          }
        } catch (err) {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        }
      },
      async handlePageChange (page) {
        this.currentPage = page
        this.pagesLoading = true
        const start = (page - 1) * this.itemLimit

        this.pages = await this.$api.service('pages').find({
          query: {
            $limit: this.itemLimit,
            $skip: start,
            $sort: {
              createdAt: -1
            }
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
  @import "assets/styles/_animations";

  .modal-card-head {
    padding-bottom: 0;

    .tabs {
      margin-top: 1rem;
      margin-bottom: -1px;

      ul {
        justify-content: flex-end;
      }
    }
  }

  @media (min-width: $tablet) {
    .modal-card-head.is-extended {
      display: flex;
      padding-top: .3rem;
    }
  }


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
