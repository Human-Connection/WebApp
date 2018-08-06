<template>
  <div class="security fullwidth-box" :class="classes">
    <b-loading :active="isLoading" />
    <div class="info-text">
      <h2 class="title is-3">
        <hc-icon icon="warning" class="icon-left is-danger" />{{ $t('auth.settings.deleteAccount') }}
      </h2>
      <p class="subtitle is-6">{{ $t('auth.settings.deleteAccountDescription') }}</p>
    </div>
    <transition name="slide-up">
      <div v-if="deleteEnabled">
        <div class="field">
          <div class="control">
            <b-checkbox type="is-danger" :disabled="!countPosts" v-model="form.deleteContributions">
              {{ $t('auth.settings.deleteCountPosts', { count: countPosts}) }}
            </b-checkbox>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <b-checkbox type="is-danger" :disabled="!countCanDos" v-model="form.deleteCandos">
              {{ $t('auth.settings.deleteCountCanDos', { count: countCanDos}) }}
            </b-checkbox>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <b-checkbox type="is-danger" :disabled="!countComments" v-model="form.deleteComments">
              {{ $t('auth.settings.deleteCountComments', { count: countComments}) }}
            </b-checkbox>
          </div>
        </div>
        <div class="message is-danger">
          <div class="message-body" v-html="$t('auth.settings.deleteAccountWarning')"></div>
        </div>
      </div>
    </transition>
    <footer class="card-footer">
      <div class="columns is-mobile">
        <div class="column">
          <b-switch type="is-danger" v-model="deleteEnabled"></b-switch>
        </div>
        <div class="column">
          <hc-button :isLoading="isLoading"
                    color="danger"
                    :disabled="isLoading || !deleteEnabled"
                    @click.prevent="deleteAccount">
            <hc-icon class="icon-left" icon="trash" />
            <span>{{ $t('auth.settings.deleteAccount', 'Delete Account') }}</span>
          </hc-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import animatable from '~/components/mixins/animatable'

  export default {
    mixins: [animatable],
    data () {
      return {
        deleteEnabled: false,
        isLoading: false,
        form: {
          deleteContributions: false,
          deleteCandos: false,
          deleteComments: false
        },
        countPosts: 0,
        countCanDos: 0,
        countComments: 0
      }
    },
    mounted () {
      this.updateRelatedCounts()
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    },
    methods: {
      updateRelatedCounts () {
        this.$api.service('contributions').find({query: {
          userId: this.user._id,
          deleted: {
            $ne: true
          },
          $limit: 0,
          type: 'post'
        }}).then((res) => this.countPosts = res.total)

        this.$api.service('contributions').find({query: {
          userId: this.user._id,
          deleted: {
            $ne: true
          },
          $limit: 0,
          type: 'cando'
        }}).then((res) => this.countCanDos = res.total)

        this.$api.service('comments').find({query: {
          userId: this.user._id,
          deleted: {
            $ne: true
          },
          $limit: 0
        }}).then((res) => this.countComments = res.total)
      },
      async deleteAccount () {
        this.$dialog.confirm({
          title: this.$t('auth.settings.deleteAccount'),
          message: this.$t('auth.settings.deleteAccountMsg'),
          confirmText: this.$t('auth.settings.deleteAccountConfirm'),
          cancelText: this.$t('button.cancel'),
          type: 'is-danger',
          focusOn: 'cancel',
          hasIcon: true,
          icon: 'trash',
          onConfirm: this.deleteAccountFinal
        })
      },
      async deleteAccountFinal () {
        try {
          this.isLoading = true
          await this.$api.service('users').remove(this.user._id, {query: this.form})
          this.$router.push({ name: 'auth-logout' })
          this.$snackbar.open({
            message: 'Your Account was Deleted!',
            type: 'is-success'
          })
          this.$nextTick(() => {
            this.$cookies.remove('feathers-jwt')
            this.$cookies.remove('io')
          })
        } catch (err) {
          console.error(err)
          this.animate('shake')
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
          this.updateRelatedCounts()
          this.isLoading = false
        }
        this.isLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_animations";

  .b-checkbox {
    font-weight: bold;
  }
</style>
