<template>
    <div class="upload">
        <div class="preview" v-if="user.avatar">
          <img :src="user.avatar">
        </div>
        <div v-else>
          <p>Avatar auswählen:</p>
        </div>
        <div class="upload-input">
          <input type="file" name="avatar" size="50" id="avatar">
        </div>
        <div class="field">
          <button class="button is-primary is-small" @click.prevent="upload">Avatar hochladen</button>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        data: {
          avatarUri: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    methods: {
      upload () {
        const reader = new FileReader()
        const file = document.getElementById('avatar').files[0]
        reader.readAsDataURL(file)

        // when encoded, upload
        reader.addEventListener('load', () => {
          this.data.avatarUri = reader.result
          this.$store.dispatch('auth/patch', this.data)
            .then(result => {
              console.log('Uploaded Avatar', result)
            })
            .catch(error => {
              this.$toast.open({
                message: error.message,
                duration: 3000,
                type: 'is-danger'
              })
            })
        }, false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .upload {
    text-align:center;
  }

  .upload-input {
    margin: 15px auto;
  }

  .preview {
    width:100px;
    height:100px;
    overflow:hidden;
    border-radius:100%;
    margin: 0 auto;
    box-shadow:0px 2px 3px rgba(0,0,0,0.5);
  }
</style>