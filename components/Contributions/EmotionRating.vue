<template>
  <div>
    <br/>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered" v-for="(emotion, key) in contribution.emotions"
           @click="onClick(key)">
        <div>
          <p class="smiley heading">
            <hc-emoji :type="key" width="50" height="50"></hc-emoji><br/>
            {{key}}
          </p>
          <p class="title">{{ formatPercent(emotion.percent) }}</p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import feathers from '~plugins/feathers'

  // TODO: move logic to store

  export default {
    name: 'hc-emotion-rating',
    props: {
      contribution: {
        type: Object,
        required: true
      },
      user: {
        type: Object
      }
    },
    mounted () {
      console.log('try to listen on patch')
      feathers.service('contributions').on('patched', res => {
        // TODO: use the new channels feature for the feathers (buzzard) when its released
        if (res._id === this.contribution._id) {
          this.contribution.emotions = res.emotions
        }
      })
    },
    beforeDestroy () {
      console.log('DESTROYING')
      feathers.service('contributions').off('patched')
    },
    methods: {
      async onClick (key) {
        console.log(key)

        let postData = {
          contributionId: this.contribution._id,
          userId: this.user ? this.user._id : null,
          rated: key
        }
        console.log(postData)

        try {
          await feathers.service('emotions').create(postData)
        } catch (err) {
          this.$toast.open({
            message: err.message,
            duration: 3000,
            type: 'is-danger'
          })
        }
      },
      generateSrc (key) {
        return `/assets/svg/emoji/${key}.svg`
      },
      formatPercent (percent) {
        return Math.floor(percent) + '%'
      }
    }
  }
</script>

<style scoped lang="scss">
  .level {
    user-select: none;
    cursor: pointer;

    .title {
      font-size: 1.2rem;
      margin-top: -0.5rem;
    }

    .level-item {
      transition: 100ms ease-in-out;

      &:active {
        transform: scale(0.92);
      }
    }
  }
</style>
