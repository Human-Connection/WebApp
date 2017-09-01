<template>
  <div>
    <br/>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered" v-for="(emotionCount, key, index) in contribution.emotions"
           @click="onClick(key)">
        <div>
          <p class="smiley heading">
            <hc-emoji :type="key" width="50"></hc-emoji><br/>
            {{key}}
          </p>
          <p class="title">{{ formatCount(emotionCount) }}</p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import feathers from '~plugins/feathers'

  export default {
    name: 'emotion-rating',
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
        this.contribution.emotions = res.emotions
      })
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
          let res = await feathers.service('emotions').create(postData)
          console.log(res)
          this.$toast.open({
            message: 'Thanks for your rating. You are awesome.',
            duration: 2000,
            type: 'is-success'
          })
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
      formatCount (count) {
        if (parseInt(count) >= 100000) {
          count = count.toString().substr(0, (count.toString().length - 3)) + 'K'
        }
        return count
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
  }
</style>
