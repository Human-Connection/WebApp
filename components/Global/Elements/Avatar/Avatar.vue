<template>
  <div class="avatar-wrapper" :class="{'is-online': isOnline}">
    <div class="img-circle profile-image"
         ref="avatar"
         :style="style">
      <hc-progressive-image
        v-if="user && hasImage"
        :alt="username"
        :src="avatar"
        :preview="preview"
        :srcset="srcset"
        @error="onError" />
      <span v-if="!hasImage">{{ userInitial }}</span>
    </div>
  </div>
</template>


<script>
  import thumbnailHelper from '~/helpers/thumbnails'
  import { throttle } from 'lodash'
  import moment from 'moment'

export default {
    name: 'hc-avatar',
    props: {
      url: {
        type: String
      },
      imageKey: {
        type: String,
        default: 'avatar'
      },
      user: {
        type: Object
      },
      name: {
        type: String
      },
      showOnlineStatus: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        backgroundColors: [
          '#295E87', '#007D93', '#933D86', '#005093', '#4A5580',
          '#0067A5', '#007D93', '#007A70', '#008F6D', '#008255',
          '#43913A', '#C61A6A', '#15A748', '#007FBA', '#008AC4',
          '#E1B424', '#00753C', '#B42554', '#4F3B68', '#EB8B2D',
          '#DC3E2A', '#A7BE33', '#DF542A', '#00A3DA', '#84BF41'
        ],
        size: 36,
        error: false,
        isOnline: false,
        interval: null
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.updateSize()
        this.updateOnlineStatus()

        if (this.showOnlineStatus) {
          this.interval = setInterval(() => {
            this.updateOnlineStatus()
          }, 1000 * 60 * 5)
        }
      })
    },
    destroyed () {
      clearInterval(this.interval)
    },
    activated () {
      this.$nextTick(() => {
        this.updateSize()
        this.updateOnlineStatus()
      })
    },
    computed: {
      username () {
        let username = this.name || this.user.name || 'Anonymus'
        return username || 'Anonymus'
      },
      hasImage () {
        return Boolean(this.avatar) && !this.error
      },
      avatar () {
        return thumbnailHelper.getThumbnail(this.user, this.imageKey, 'small')
      },
      preview () {
        return thumbnailHelper.getThumbnail(this.user, this.imageKey, 'placeholder')
      },
      srcset () {
        return thumbnailHelper.srcSetFromThumbnails(this.user, this.imageKey, ['large', 'medium', 'small'])
      },
      userInitial () {
        return this.initial(this.username)
      },
      background () {
        return this.backgroundColor || this.randomBackgroundColor(this.username.length, this.backgroundColors)
      },
      fontColor () {
        return this.color || this.lightenColor(this.background, 200)
      },
      style () {
        return {
          backgroundColor: this.hasImage ? 'transparent' : this.background,
          fontSize: Math.floor(this.size / 2.5) + 'px',
          fontWeight: 'bold',
          color: this.fontColor,
          lineHeight: `${(this.size + Math.floor(this.size / 20))}px`
        }
      }
    },
    watch: {
      'user.name' (name) {
        this.initial(name)
        this.updateSize()
        this.updateOnlineStatus()
      },
      name (name) {
        this.initial(name)
        this.updateSize()
        this.updateOnlineStatus()
      }
    },
    methods: {
      onError (e) {
        this.error = true
      },
      initial (username) {
        let un = username || 'Anonymus'
        let parts = un.split(/[ -]/)
        let initials = ''
        for (var i = 0; i < parts.length; i++) {
          initials += parts[i].charAt(0)
        }
        if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
          initials = initials.replace(/[a-z]+/g, '')
        }
        initials = initials.substr(0, 3).toUpperCase()
        return initials
      },
      randomBackgroundColor (seed, colors) {
        return colors[seed % (colors.length)]
      },
      lightenColor (hex, amt) {
        // From https://css-tricks.com/snippets/javascript/lighten-darken-color/
        var usePound = false
        if (hex[0] === '#') {
          hex = hex.slice(1)
          usePound = true
        }
        var num = parseInt(hex, 16)
        var r = (num >> 16) + amt
        if (r > 255) r = 255
        else if (r < 0) r = 0
        var b = ((num >> 8) & 0x00FF) + amt
        if (b > 255) b = 255
        else if (b < 0) b = 0
        var g = (num & 0x0000FF) + amt
        if (g > 255) g = 255
        else if (g < 0) g = 0
        return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
      },
      updateSize () {
        if (this.hasImage) {
          return
        }
        try {
          this.size = this.$refs.avatar.getBoundingClientRect().width
        } catch (err) {}
      },
      resizeHandler: throttle(() => {
        this.updateSize()
      }, 200),
      updateOnlineStatus () {
        if (!this.showOnlineStatus) {
          return
        }

        if (this.user.lastActiveAt) {
          this.isOnline = this.user.lastActiveAt && moment(this.user.lastActiveAt).diff(moment(), 'minutes') >= -15
        } else {
          this.isOnline = false
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .avatar-wrapper {

    position: relative;
    &.is-online:after {
      content: "";
      display: block;
      position: absolute;
      background-color: $green;
      border-radius: 50%;
      border: 2px solid white;
      width: 30%;
      height: 30%;
      bottom: 0;
      right: 0;
      z-index: 10;
    }

    &.is-big {
      position: initial;

      &.is-online:after {
        width: 22%;
        height: 22%;
        border-width: 3px;
        bottom: 2%;
        right: 2%;
      }
    }
  }

  .profile-image {
    box-shadow:      0 0 0 1px white;
    width:           36px;
    height:          36px;
    background:      #fff no-repeat center;
    overflow:        hidden;

    img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover;
        overflow: hidden;
    }

    text-align: center;
    display: flex;

    span {
      text-align: center;
      align-self: center;
      justify-self: center;
      display: block;
      width: 100%;
      margin-top: -1px;
      font-weight: bold;
    }
  }

  .img-circle {
    border-radius: 50%;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    &:before {
      border-radius: 50%;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }

</style>
