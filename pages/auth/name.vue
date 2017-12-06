<template>
    <section class="container content">
        <div class="card">
            <div class="card-content">
                <div class="card-teaser">
                    <img src="/assets/images/registration/nicetomeetyou.svg" alt="Human Connection"/>
                </div>
                <h1 class="title is-3 is-spaced">{{ $t('auth.account.nameSection') }}</h1>
                <p class="subtitle is-6">{{ $t('auth.account.nameDescription') }}</p>

                <upload-avatar refresh="800"></upload-avatar>

                <form @submit.prevent="save">
                    <div class="field">
                        <p class="control has-icons-right">
                            <input ref="focus" autofocus class="input " v-bind:class="{ 'is-danger': errors }"
                                   type="text" v-bind:placeholder="$t('auth.account.namePlaceholder')"
                                   v-model="data.name" autofocus>
                            <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <p>
            <hc-button color="primary" size="medium" type="button" class="is-fullwidth" :loading="loading">
              {{ $t('button.save') }}
            </hc-button>
          </p>
        </form>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-welcome' }" class="card-footer-item">
          {{ $t('button.skip') }}
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import UploadAvatar from '~/components/User/UploadAvatar'
  import Vue from 'vue'

  export default {
    middleware: 'authenticated',
    layout: 'blank',
    components: {
      'upload-avatar': UploadAvatar
    },
    data () {
      return {
        data: {
          name: ''
        },
        loading: false,
        errors: null
      }
    },
    mounted () {
      Vue.nextTick(() => {
        this.$refs['focus'].focus()
      })
    },
    methods: {
      async save () {
        this.errors = false
        this.loading = true
        this.$store.dispatch('auth/patch', this.data)
          .then(() => {
            this.loading = false
            this.$router.push({name: 'auth-welcome'})
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            this.errors = true
            this.loading = false
          })
      }
    },
    head () {
      return {
        title: this.$t('auth.account.nameTitle')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";

  .card {
      margin: 0 auto;
      max-width: 460px;
      text-align: center;
      border: none;
      box-shadow: $card-shadow;
  }

  .card-teaser {
    img {
      display: inline-block;
      max-width: 200px;
      height: auto;

      @include tablet {
        max-width: 260px;
      }
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
