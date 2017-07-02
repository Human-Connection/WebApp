<template>
    <div class="hc__upload content">
        <form method="post" enctype="multipart/form-data" @submit.prevent="upload">
          <h1>Wähle eine Datei</h1>
          <div class="field">
            <p class="control">
              <label>
                <input name="datei" type="file" size="50" id="file">
              </label>
            </p>
          </div>
          <div class="field">
            <button class="button is-primary is-medium">Datei hochladen</button>
          </div>
        </form>
        <div class="uploads">
          <div v-for="file in files" class="file">
            <div class="file-inner">
              <img :src="file">
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  import feathers from '~plugins/feathers'

  export default {
    data () {
      return {
        files: [],
        filebase: 'http://localhost:3030/uploads/'
      }
    },
    methods: {
      upload () {
        const reader = new FileReader()
        const file = document.getElementById('file').files[0]
        console.log(file)
        reader.readAsDataURL(file)

        // when encoded, upload
        reader.addEventListener('load', () => {
          console.log('encoded file: ', reader.result)
          feathers.service('uploads')
            .create({uri: reader.result})
            .then(response => {
              console.log('File uploaded!', response)
              this.files.push(
                this.filebase + response.id
              )
            })
            .catch(error => {
              console.log('Error uploading file!', error)
            })
        }, false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .uploads {
    &:after {
      display: table;
      content: '';
      clear: both;
    }
  }

  .file {
    width:25%;
    padding:20px;
    float:left;
    background: #fff;

    img {
      width:100%;
      height:auto;
    }
  }

  .file-inner {
    overflow:hidden;
    width:100%;
    height:250px;
  }

</style>