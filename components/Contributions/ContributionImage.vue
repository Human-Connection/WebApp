<template>
    <div class="text-center hc__imagecontainer" v-if="src"
         v-bind:style="{'background-image': `url(${getUrl})`}" @click="imageModal()">
    </div>
</template>

<script>
  /* eslint-disable indent */

  export default {
    name: 'hc-contribution-image',
    props: {
      src: {
        type: String
      }
    },
    data () {
      return {
        data: {
          url: ''
        }
      }
    },
    created () {
      this.data.url = this.src
    },
    computed: {
      getUrl () {
        return this.data.url
      }
    },
    mounted () {
      // this is fixin an issue with the default avatar
      // while picking the name after regestration
      setTimeout(() => {
        // retry to load image
        this.data.url = null
        setTimeout(() => {
          this.data.url = this.src
        }, 0)
      }, 700)
    },
    methods: {
      imageModal () {
        this.$modal.open({
            content: `<p class="image">
                          <img src="${this.src}">
                      </p>`,
            animation: 'zoom-in'
          }
        )
      }
    }
  }
</script>

<style scoped lang="scss">
    .hc__imagecontainer {
        height: 300px;
        background-size: cover;
        background-position: center;
        // overflow: hidden;
        margin: -3rem -1.5rem 1.5rem;
        cursor: zoom-in;
    }
</style>
