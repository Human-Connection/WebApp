import Vue from 'vue'
import linkifyHtml from 'linkifyjs/html'

const ModalForm = {
  props: {
    query: {
      type: [String, Object],
      required: true
    }
  },
  mounted () {
    this.$nextTick(this.loadPage)
  },
  data () {
    return {
      title: '',
      content: '',
      isLoading: false
    }
  },
  methods: {
    loadPage () {
      this.isLoading = true

      const data = (typeof this.query === 'string') ? {key: this.query} : this.query
      const query = Object.assign({
        $limit: 1,
        language: this.$i18n.locale()
      }, data)

      this.$api.service('pages').find({query})
        .then(res => {
          if (res && res.data && res.data.length) {
            this.title = res.data[0].title
            this.content = linkifyHtml(res.data[0].content)
          } else {
            this.title = 'ERROR'
            this.content = '<img src="/assets/svg/errors/error404.svg" style="padding: 2rem 3rem;" />'
          }
          this.isLoading = false
        }).catch((err) => {
          this.title = 'ERROR: ' + err.message
          this.content = '<img src="/assets/svg/errors/error404.svg" style="padding: 2rem 3rem;" />'
          this.isLoading = false
        })
    }
  },
  template: `
    <div>
      <div class="modal-background"></div>
      <div class="modal-card ">
        <b-loading :is-full-page="false" :active="isLoading" />
        <header v-if="!isLoading" class="modal-card-head">
          <p class="title is-3 modal-card-title">{{ title }}</p>
        </header>
        <section class="modal-card-body">
          <div class="content" v-html="content"></div>
        </section>
        <footer class="modal-card-foot">
          <hc-button color="light"
                      @click="$emit('close')"
                      :disabled="isLoading">
            <hc-icon class="icon-left" icon="times" /> {{ $t('button.close' ) }}
          </hc-button>
        </footer>
      </div>
    </div>
  `
}

Vue.use({
  install (Vue, store) {
    Vue.prototype.$openInModal = function (query, callback) {
      this.$modal.open({
        props: {
          query
        },
        component: ModalForm,
        hasModalCard: true,
        animation: 'zoom-in',
        onCancel: callback
      })
    }
  }
})
