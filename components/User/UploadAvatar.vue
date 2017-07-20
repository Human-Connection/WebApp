<template>
    <div class="upload">
        <div class="upload-input" @click="choose">
            <input type="file" class="file-input" @change="upload" ref="file" accept=".jpg,.jpeg,.gif,.png,.pneg">
            <div class="preview" v-bind:style="{ 'background-image': 'url(' + user.avatar + ')' }">
                <strong v-if="!user.avatar"><br/>Avatar auswählen</strong>
            </div>
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
      choose () {
        this.$refs.file.click()
      },
      upload () {
        const reader = new FileReader()
        const file = this.$refs.file.files[0]
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

    .file-input {
        display: none;
    }

    .upload {
        text-align:       center;
        width:            100px;
        height:           100px;
        cursor:           pointer;
        display:          inline-block;
        background-color: #fff;
        border-radius:    100%;
        overflow:         hidden;
        position:         relative;
    }

    .upload-input {
        height: 100%;
        width:  100%;
    }

    .preview {
        display:             inline-block;
        width:               100%;
        height:              100%;
        overflow:            hidden;
        border-radius:       100%;
        margin:              0 auto;
        border:              1px solid rgba(204, 204, 204, 0.5);
        background-position: center;
        background-size:     cover;
    }
</style>