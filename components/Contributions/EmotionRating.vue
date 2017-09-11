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
          <p class="title">
            <count-to :ref=key :startVal=values[key].startVal :endVal=values[key].endVal
                      suffix=' %' :duration=1000 :autoplay="true"></count-to>
          </p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import countTo from 'vue-count-to'
  import _ from 'lodash'

  // TODO: move logic to store

  export default {
    name: 'hc-emotion-rating',
    components: {
      'count-to': countTo
    },
    props: {
      contribution: {
        type: Object,
        required: true
      },
      user: {
        type: Object
      }
    },
    data () {
      return {
        values: {}
      }
    },
    created () {
      // calculate current value
      _.keys(this.contribution.emotions).forEach(key => {
        this.values[key] = {
          startVal: 0,
          endVal: this.contribution.emotions[key].percent
        }
      })
    },
    mounted () {
      console.log('try to listen on patch')
      feathers.service('contributions').on('patched', res => {
        // TODO: use the new channels feature for the feathers (buzzard) when its released
        if (res._id === this.contribution._id) {
          _.keys(this.contribution.emotions).forEach((key) => {
            this.$refs[key][0].pause()
            this.values[key].startVal = this.values[key].endVal
            this.values[key].endVal = this.contribution.emotions[key].percent
            this.$refs[key][0].start()
          })
          this.contribution.emotions = res.emotions
        }
      })
    },
    beforeDestroy () {
      feathers.service('contributions').off('patched')
    },
    methods: {
      async onClick (key) {
        let postData = {
          contributionId: this.contribution._id,
          userId: this.user ? this.user._id : null,
          rated: key
        }
        try {
          await feathers.service('emotions').create(postData)
        } catch (err) {
          if (err.code === 401) {
            this.$router.push({
              name: 'auth-login',
              params: {
                path: this.$route.path
              }
            })
          }
          this.$toast.open({
            message: err.message,
            duration: 3000,
            type: 'is-danger'
          })
        }
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
