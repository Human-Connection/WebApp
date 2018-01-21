<template>
  <div class="hc-upload" :class="classes">
    <div class="hc-preview">
      <hc-progressive-image
        :src="previewImage"
        :preview="previewImage"
        v-if="previewImage" />
    </div>
    <div class="hc-upload-progress">
      <hc-progress-bar :progress="progress" />
    </div>
    <div class="hc-upload-area" v-if="ready && token">
      <vue-clip :options="options"
        @sending="startSending"
        @complete="complete"
        @added-file="addedFile"
        @drag-enter="startDragging"
        @drag-end="stopDragging"
        @drag-leave="stopDragging"
        @drop="stopDragging"
        @total-progress="updateProgress">
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
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  /*
  * We use a forked version of vue-clip here
  * because the old one is not using the newest
  * dropzone features
  *
  * URL: https://github.com/alexsasharegan/vue-clip
  *
  * This version just wraps dropzone in a component
  * and exposes all its options and events to
  * vue-clip component
  *
  * For options and events, see dropzone documentation
  * URL: http://www.dropzonejs.com/#configuration-options
   */

  export default {
    name: 'hc-upload',
    props: {
      previewImage: {
        type: String,
        default: ''
      },
      test: {
        type: Boolean,
        default: false
      },
      maxWidth: {
        type: Number,
        default: 1000
      },
      maxHeight: {
        type: Number,
        default: 800
      },
      maxFileSize: {
        type: Number,
        default: 10
      }
    },
    data () {
      return {
        vueClip: {},
        ready: false,
        image: null,
        sending: false,
        dragging: false,
        progress: 0,
        errorMessage: '',
        generalError: this.$t('upload.errors.general'),
        options: {
          url: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/uploads',
          paramName: 'file',
          parallelUploads: 1,
          maxFilesize: {
            limit: this.maxFileSize,
            message: this.$t('upload.errors.maxFilesize', {
              'size': `${this.maxFileSize} MB`
            })
          },
          uploadMultiple: false,
          acceptedFiles: 'image/*',
          resizeWidth: this.maxWidth,
          resizeHeight: this.maxHeight,
          headers: {}
        }
      }
    },
    computed: {
      ...mapGetters({
        token: 'auth/token'
      }),
      classes () {
        let classes = []
        if (this.previewImage) {
          classes.push('preview')
        }
        if (this.dragging) {
          classes.push('dragging')
        }
        if (this.sending) {
          classes.push('sending')
        }
        return classes.join(' ')
      },
      maxDimensions () {
        return {
          width: this.maxWidth,
          height: this.maxHeight
        }
      }
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
      addedFile () {
        this.errorMessage = ''
        this.sending = true
        this.$emit('start-sending')
      },
      startSending () {
        //
      },
      complete (file) {
        if (!file || !file.status || file.status !== 'success') {
          this.errorMessage = file && typeof file.errorMessage === 'string'
            ? file.errorMessage
            : this.generalError
          this.$snackbar.open({
            message: this.errorMessage,
            duration: 4000,
            type: 'is-error'
          })
          this.resetLoader()
          return
        }
        const basepath = 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/uploads/'
        const url = JSON.parse(file.xhr.responseText).id

        this.image = `${basepath}${url}`

        if (this.test) {
          this.fakeProgress()
        } else {
          this.$emit('update', this.image)
          this.resetLoader()
        }
      },
      // Fake progress in development
      fakeProgress () {
        this.progress += 5
        if (this.progress === 100) {
          this.$emit('update', this.image)
          this.resetLoader()
          return
        }
        setTimeout(() => {
          this.fakeProgress()
        }, 50)
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
      },
      updateProgress (progress) {
        if (!this.test) {
          this.progress = progress
        }
      },
      resetLoader () {
        this.sending = false
        setTimeout(() => {
          this.progress = 0
          this.$emit('stop-sending')
        }, 500)
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

    &.sending {
      pointer-events: none;
    }
  }

  .hc-preview {
    transition: all 0.2s ease-out;

    width: 100%;
    height: 100%;

    > .progressive {
      width: 100%;
      height: 100%;

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
      }
    }

    .hc-upload:hover &,
    .hc-upload.dragging &,
    .hc-upload.sending & {
      opacity: 0.65;
    }
  }

  .hc-upload-progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .sending .hc-upload-progress {
    background: rgba(255, 255, 255, .5);
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

  .hc-attachments-upload-button {
    pointer-events: none;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      border-size: 10px;
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      border-size: 40px;
      opacity: 0;
    }
    100% {
      transform: scale(1);
      border-size: 10px;
      opacity: 1;
    }
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

    background-color: rgba(255,255,255,0.3);
    opacity: 0.3;

    &:before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 100%;
      border: 20px solid rgba(255,255,255,0.4);
      visibility: hidden;

      .hc-upload.sending & {
        visibility: visible;
        animation-name: pulse;
        animation-duration: 2s;
        animation-iteration-count: infinite;
      }
    }

    &:after {
      position: absolute;
      content: '';
      top: 10px;
      left: 10px;
      bottom: 10px;
      right: 10px;
      border-radius: 100%;
      border: 1px dashed $grey-darker;
    }

    .hc-upload.preview & {
      opacity: 0;
    }

    .hc-attachments-upload-area:hover &,
    .hc-upload.dragging &,
    .hc-upload.sending & {
      opacity: 1;
    }
  }

  .hc-warning {
    text-align: center;
    color: $red;
  }
</style>
