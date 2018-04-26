<template>
  <div class="comment-form-container" v-if="post && isVerified">
    <div class="comment-form-aside">
      <hc-avatar :user="user" />
    </div>
    <form class="comment-form" @submit.prevent="submitComment">
      <hc-editor identifier="comment"
        editorClass="autowrap"
        v-model="form.content"
        :editorOptions="editorOptions" />
      <div class="comment-form-actions">
        <button type="button"
          class="button is-hidden-mobile"
          :disabled="!this.hasContent"
          @click="form.content = ''"
          :class="{ 'is-loading': isLoading }">
          {{ $t('button.cancel') }}
        </button>
        <button type="submit"
          class="button is-primary"
          :disabled="!this.hasContent"
          :class="{ 'is-loading': isLoading }">
          {{ $t('button.submitComment','Submit comment') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { trim } from 'lodash'

  export default {
    name: 'hc-comment-form',
    props: ['post'],
    data () {
      return {
        isLoading: false,
        form: {
          content: '',
          contributionId: null,
          language: 'en'
        },
        editorOptions: {
          placeholder: this.$t('component.contribution.commentPlaceholder', 'Whatever comes to your mind...'),
          modules: {
            toolbar: null
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        isVerified: 'auth/isVerified',
        user: 'auth/user'
      }),
      hasContent () {
        return !!trim(this.form.content.replace(/(<([^>]+)>)/ig, '')).length
      }
    },
    methods: {
      async submitComment () {
        if (!this.hasContent) {
          this.form.content = ''
          return
        }
        this.isLoading = true
        this.form.contributionId = this.post._id
        await this.$store.dispatch('comments/create', this.form)
          .then((res) => {
            this.$store.dispatch('comments/fetchByContributionId', this.post._id)
            this.$snackbar.open({
              message: this.$t('component.contribution.commentSubmitSuccess', 'Thanks for your comment. You are awesome.'),
              duration: 4000,
              type: 'is-success'
            })
            this.form.content = ''
          })
          .catch((error) => {
            console.error(error)
            this.$toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
        this.isLoading = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment-form-container {
    border-top: 1px solid $grey-lighter;
    margin-top: $margin-large;
    padding-top: $margin-large;
    display: flex;
  }

  .comment-form-aside {
    flex: 0 0 51px;
    width: 51px;
    padding-top: 5px;
  }

  .comment-form {
    flex: 1 1 0;
  }

  .comment-form-actions {
    padding-top: $padding-small;
    display: flex;
    justify-content: space-between;

    .button {
      width: 100%;

      @media (min-width: $tablet) {
        width: auto;
        min-width: 160px;
      }
    }
  }

</style>
