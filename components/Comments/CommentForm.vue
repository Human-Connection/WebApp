<template>
    <form class="comment-form" v-if="post && isAuthenticated" @submit.prevent="submitComment">
        <textarea class="textarea" placeholder="Leave a comment ..." v-model="form.content"></textarea>
        <button type="submit" class="button">Kommentar speichern</button>
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

<style>
    .profile-image {
        border: 1px solid #ccc
    }

    small {
        display:        block;
        text-align:     center;
        text-transform: uppercase;
        padding:        5px 10px;
        margin:         0 auto;
    }

    .profile-image {
        width:               36px;
        height:              36px;
        background-position: center;
        background-size:     cover;
    }

    .img-circle {
        border-radius: 50%;
    }
</style>
