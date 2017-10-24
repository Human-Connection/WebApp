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
      },
      refresh: {
        type: [Number, String]
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
    watch: {
      src (src) {
        this.data.url = src
      }
    },
    computed: {
      getUrl () {
        return this.data.url
      }
    },
    mounted () {
      // this is fixin an issue with the default avatar
      // while picking the name after regestration
      if (parseInt(this.refresh) > 0) {
        setTimeout(() => {
          // retry to load image
          this.data.url = null
          this.$nextTick(() => {
            this.data.url = this.src
          }, 0)
        }, parseInt(this.refresh))
      }
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
    @import 'assets/styles/utilities';

    .hc__imagecontainer {
        height: 300px;
        background-size: cover;
        background-position: top;
        // overflow: hidden;
        margin: -3rem -1.5rem 1.5rem;
        cursor: zoom-in;

        @include mobile() {
            height: 60vw;
        }
        @include tablet-only() {
            height: 40vw;
        }
    }
</style>
