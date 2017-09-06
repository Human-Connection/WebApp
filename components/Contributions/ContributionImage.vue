<template>
  <div class="text-center hc__imagecontainer" v-if="src"
       v-bind:style="{'background-image': `url(${src})`}" @click="imageModal()">
  </div>
</template>

<script>
  export default {
    name: 'hc-contribution-image',
    props: {
      src: {
        type: String
      }
    },
    methods: {
      imageModal () {
        this.$modal.open(
          `<p class="image">
              <img src="${this.src}">
          </p>`
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
