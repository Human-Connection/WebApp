<template>
  <div>
    <br/>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered" v-for="(emotionCount, key, index) in contribution.emotions"
           @click="onClick(key)">
        <div>
          <p class="smiley heading">
            <img v-bind:src="generateSrc(index)" /><br/>
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
      generateSrc (index) {
        let i = parseInt(index) + 1
        return `/assets/svg/hc-smilies-0${i}.svg`
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

    img {
      height: 50px;
      display: block;
      margin: auto;
    }
    .title {
      font-size: 1.2rem;
      margin-top: -0.5rem;
    }
  }
  .rating {
    margin-top: 1rem;
    height: 50px;
    img {
      float: left;
      margin-right: 10px;
      height: 50px;
    }
    &:after {
      clear: both;
    }
  }
</style>
