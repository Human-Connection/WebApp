<template>
  <b-modal :active.sync="modalIsOpen" has-modal-card animation="zoom-in">
    <div class="modal-background"></div>
    <div class="modal-card" :class="classes">
      <b-loading :is-full-page="false" :active="isLoading" />
      <header class="modal-card-head is-extended">
        <h4 class="modal-card-title">{{ $t(`component.admin.${form._id ? 'pageEdit' : 'pageCreate'}`) }}</h4>
        <div class="tabs">
          <ul>
            <li :class="{
                  'is-active': currentModalLang === 'en',
                  'has-error': $v.form.en.$error
                }">
              <a @click.prevent="currentModalLang = 'en'">
                <hc-icon v-if="$v.form.en.$error" icon="times" />
                <img v-else width="16" :src="`/assets/svg/flags/en.svg`" />
                &nbsp;{{ $t('component.admin.languageEN') }}
              </a>
            </li>
            <li :class="{
                  'is-active': currentModalLang === 'de',
                  'has-error': $v.form.de.$error
                }">
              <a @click.prevent="currentModalLang = 'de'">
                <hc-icon v-if="$v.form.de.$error" icon="times" />
                <img v-else width="16" :src="`/assets/svg/flags/de.svg`" />
                &nbsp;{{ $t('component.admin.languageDE') }}
              </a>
            </li>
          </ul>
        </div>
      </header>
      <section class="modal-card-body" ref="modalContent">
        <page-form key="en"
              v-if="currentModalLang === 'en'"
              :data="form.en"
              language="en"
              :v="$v"
              :type="form.de.type"
              :formKey="form.de.key"
                />
        <page-form key="de"
              v-if="currentModalLang === 'de'"
              :data="form.de"
              language="de"
              :v="$v"
              :type="form.de.type"
              :formKey="form.de.key"
                />
      </section>
      <footer class="modal-card-foot">
        <hc-button color="light" @click.prevent="modalIsOpen = false">
          <hc-icon icon="times" />
          &nbsp; {{ $t('button.cancel') }}
        </hc-button>
        <hc-button color="success"
                    @click="validate"
                    :isLoading="isLoading"
                    :disabled="isLoading">
          <hc-icon class="icon-left" icon="check" /> {{ $t('button.save') }}
        </hc-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength } from "vuelidate/lib/validators"
  import animatable from '~/components/mixins/animatable'
  import pageForm from '~/components/Pages/PageForm'

  const languages = ['de', 'en']
  let defaultForm = {
    _id: null,
    type: 'page',
    key: null,
    title: '',
    content: '',
    language: 'en'
  }

  export default {
    mixins: [animatable, validationMixin],
    name: 'page-form-modal',
    components: {
      pageForm
    },
    props: {
      page: {
        requried: true,
        type: Object
      }
    },
    data () {
      defaultForm.language = this.$i18n.locale()

      return {
        modalIsOpen: false,
        currentModalLang: defaultForm.language,
        isLoading: false,
        form: {
          en: Object.assign({}, defaultForm),
          de: Object.assign({}, defaultForm)
        }
      }
    },
    methods: {
      validate () {
        languages.forEach(lang => {
          if (this.$v.form[lang].$invalid) {
            this.$v.form[lang].$touch()
            return false
          } else {
            // return validated form data
            return true
          }
        })
        if (this.$v.$invalid) {
          this.animate('shake')
          this.$toast.open({
            message: this.$t('component.contribution.validationError'),
            type: 'is-danger'
          })
          setTimeout(() => {
            this.$scrollTo(this.$refs.title, 500, {
              container: this.$refs.modalContent
            })
            this.$v.form[this.currentModalLang].$touch()
          }, 500)
        } else {
          this.save()
        }
      },
      save () {
        let promises = []
        languages.forEach((lang) => {
          const formData = Object.assign({}, defaultForm, this.form[lang])
          let res
          if (!formData._id) {
            promises.push(this.$api.service('pages').create(formData).then(res => this.form[lang] = res))
          } else {
            promises.push(this.$api.service('pages').patch(formData._id, formData).then(res => this.form[lang] = res))
          }
        })
        this.isLoading = true
        Promise.all(promises)
          .then(() => {
            this.isLoading = false
            this.modalIsOpen = false
          })
          .catch(err => {
            console.error(err)
            this.animate('shake')
            this.isLoading = false
            this.$toast.open({
              message: err.message,
              type: 'is-danger'
            })
          })
      },
      load (key) {
        this.isLoading = true
        this.$api.service('pages').find({query: {key}})
          .then(res => {
            this.isLoading = false
            res.data.forEach(item => {
              this.form[item.language] = item
            })
          })
          .catch(err => {
            console.error(err)
            this.animate('shake')
            this.isLoading = false
          })
      }
    },
    watch: {
      page (page) {
        if (page === null) {
          return
        }

        this.form.de = Object.assign({}, defaultForm)
        this.form.en = Object.assign({}, defaultForm)

        if (page.language) {
          this.form[page.language] = Object.assign(this.form[page.language], page)
          this.currentModalLang = page.language
        } else {
          this.currentModalLang = defaultForm.language
        }

        if (page.key) {
          this.load(page.key)
        }

        this.modalIsOpen = true
      },
      modalIsOpen (open) {
        if (!open) {
          this.$emit('close')
          this.$v.$reset()
        }
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
          required
        }
      }

      return {
        form: {
          en: rules,
          de: rules
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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

  .has-error {

    &.is-active a {
      border-bottom-color: $red;
    }

    a {
      color: $red !important;
      & > .fa-times {
        color: $red !important;
      }
    }

  }

</style>
