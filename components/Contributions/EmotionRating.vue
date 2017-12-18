<template>
  <div>
    <br/>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered" v-for="(emotion, key) in contribution.emotions"
           @click="onClick(key)">
        <div :title="$t('component.emotionRating.tooltip')">
          <p class="smiley heading">
            <hc-emoji :type="getEmoticon(key)" width="50" height="50"></hc-emoji><br/>
            {{ $t('component.emotionRating.' + key) }}
          </p>
          <p class="title">
            <count-to v-if="wasAtLeastOnceVisible" :ref=key :startVal=values[key].startVal :endVal=values[key].endVal
                      suffix=' %' :duration=2000 :autoplay="true"></count-to>
            <template v-else>
                0%
            </template>
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
  import inViewport from 'vue-in-viewport-mixin'

  // TODO: move logic to store

  export default {
    name: 'hc-emotion-rating',
    mixins: [ inViewport ],
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
        values: {},
        selected: null,
        wasAtLeastOnceVisible: false
      }
    },
    created () {
      _.keys(this.contribution.emotions).forEach(key => {
        this.values[key] = {
          startVal: 0,
          endVal: this.contribution.emotions[key].percent
        }
      })
    },
    mounted () {
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
      getEmoticon (key) {
        if (this.selected === key) {
          return `${key}_color`
        }
        return key
      },
      async onClick (key) {
        this.selected = key
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
    },
    watch: {
      'inViewport.fully' () {
        if (this.inViewport.fully && process.browser) {
          this.inViewport.listening = false
          setTimeout(() => {
            this.wasAtLeastOnceVisible = true
          }, 500)
        }
      },
      wasAtLeastOnceVisible (visible) {
        if (visible) {
          // calculate current value
          if (this.user) {
            feathers.service('emotions').find({
              query: {
                contributionId: this.contribution._id,
                userId: this.user._id
              }
            }).then((res) => {
              if (res && !_.isEmpty(res.data)) {
                this.selected = res.data[0].rated
              }
            })
          }
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
