<template>
    <div class="upload">
        <div class="upload-input" @click="choose">
            <input type="file" class="file-input" @change="upload" ref="file" accept=".jpg,.jpeg,.gif,.png,.pneg">
            <div class="preview" v-bind:style="{ 'background-image': 'url(' + getAvatar + ')' }">
                <strong v-if="!getAvatar"><br/>Avatar auswählen</strong>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      refresh: {
        type: [Number, String]
      }
    },
    data () {
      return {
        data: {
          avatarUri: ''
        }
      }
    },
    created () {
      this.data.avatarUri = this.user.avatar
    },
    name: 'UploadAvatar',
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      getAvatar () {
        return this.data.avatarUri
      }
    },
    mounted () {
      // this is fixin an issue with the default avatar
      // while picking the name after regestration
      if (parseInt(this.refresh) > 0) {
        setTimeout(() => {
          // retry to load image
          this.data.avatarUri = null
          this.$nextTick(() => {
            this.data.avatarUri = this.user.avatar
          })
        }, this.refresh)
      }
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
        box-shadow:          inset 0 0 0 1px rgba(0, 0, 0, .1);
        background-position: center;
        background-size:     cover;
    }
</style>