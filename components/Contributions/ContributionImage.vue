<template>
  <div class="text-center hc__imagecontainer" v-if="src"
       v-bind:style="{'background-image': `url(${src})`}" @click="imageModal()">
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
    mounted () {
      // this is fixin an issue with the default avatar
      // while picking the name after regestration
      setTimeout(() => {
        // retry to load image
        let src = this.src
        this.src = null
        setTimeout(() => {
          this.src = src
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
