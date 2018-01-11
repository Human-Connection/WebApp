<template>
  <div class="hc-upload"
    :class="{ 'has-preview' : previewImage, 'dragging' : dragging }">
    <div class="hc-preview">
      <hc-progressive-image
        :src="previewImage"
        :preview="previewImage"
        v-if="previewImage" />
    </div>
    <div class="hc-upload-area" v-if="ready && token">
      <vue-clip :options="options"
        :on-complete="complete"
        :on-added-file="addedFile"
        :on-drag-enter="startDragging"
        :on-drag-leave="stopDragging">
        <template slot="clip-uploader-action">
          <div>
            <div class="dz-message">
              <div class="hc-attachments-upload-area">
                <div class="hc-attachments-upload-button">
                  <div class="hc-drag-marker">
                    <hc-icon icon="image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vue-clip>
    </div>
    <div class="hc-warning" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'hc-upload',
    props: {
      previewImage: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        ready: false,
        image: null,
        dragging: false,
        errorMessage: '',
        options: {
          url: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/uploads',
          paramName: 'file',
          parallelUploads: 1,
          maxFilesize: {
            limit: 5,
            message: 'Die maximale erlaubte Dateigröße beträgt 5 MB.'
          },
          uploadMultiple: false,
          acceptedFiles: {
            extensions: ['image/*'],
            message: 'Bitte wähle ein Bild aus.'
          },
          headers: {}
        }
      }
    },
    computed: {
      ...mapGetters({
        token: 'auth/token'
      })
    },
    methods: {
      checkToken () {
        if (!this.token) {
          return
        }
        this.options.headers = {
          'Authorization': this.token
        }
        this.ready = true
      },
      addedFile (file) {
        this.errorMessage = ''
      },
      complete (file) {
        if (!file || !file.status || file.status !== 'success') {
          this.errorMessage = file.errorMessage
          return
        }

        const basepath = 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/uploads/'
        const url = JSON.parse(file.xhrResponse.responseText).id

        this.image = `${basepath}${url}`
        this.$emit('update', this.image)
      },
      deleteItem (index) {
        this.image = null
        this.$emit('update', this.image)
      },
      startDragging () {
        this.dragging = true
      },
      stopDragging () {
        this.dragging = false
      }
    },
    watch: {
      token () {
        this.checkToken()
      }
    },
    mounted () {
      this.checkToken()
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .hc-upload {
    position: relative;
    min-height: 160px;
    background-color: $white-ter;
  }

  .hc-preview {
    transition: all 0.2s ease-out;

    .hc-upload:hover &, .hc-upload.dragging & {
      opacity: 0.65;
    }
  }

  .hc-attachments-upload-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .hc-drag-marker {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $grey-darker;
    transition: all 0.2s ease-out;
    font-size: 60px;

    background-color: rgba(255,255,255,0.5);
    opacity: 0.3;

    &:before {
      position: absolute;
      content: '';
      top: 10px;
      left: 10px;
      bottom: 10px;
      right: 10px;
      border-radius: 100%;
      border: 1px dashed $grey-darker;
    }

    .hc-upload.has-preview & {
      opacity: 0;
    }

    .hc-attachments-upload-area:hover &, .hc-upload.dragging & {
      opacity: 1;
    }
  }

  .hc-warning {
    text-align: center;
    color: $red;
  }
</style>
