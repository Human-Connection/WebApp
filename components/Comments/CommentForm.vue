<template>
    <form class="comment-form" v-if="post && isAuthenticated" @submit.prevent="submitComment">
        <textarea class="textarea" placeholder="Was sagst du dazu?" v-model="form.content"></textarea>
        <button type="submit" class="button is-small is-primary is-fullwidth" :class="{ 'is-loading': loading }">Kommentar abschicken</button>
    </form>
</template>


<script>
  import {mapGetters} from 'vuex'
  import feathers from '~plugins/feathers'

  export default {
    props: ['post'],
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated'
      })
    },
    data () {
      return {
        loading: false,
        form: {
          content: '',
          contributionId: null,
          language: 'de_DE'
        }
      }
    },
    methods: {
      submitComment () {
        this.loading = true
        this.form.contributionId = this.post._id
        console.log(this.form)
        feathers.service('comments').create(this.form)
          .then((res) => {
            this.loading = false
            this.form.content = ''
            console.log(res)
            this.$toast.open({
              message: 'Thanks for your comment. You are awesome.',
              duration: 2000,
              type: 'is-success'
            })
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
          })
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variables";

    .textarea {
        margin-bottom:10px;
        min-height: 80px;
        font-size: $size-7;
    }
</style>
